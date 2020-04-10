import {
    AssignRecipeMessage,
    DesignSystemMessage,
    MessageAction,
    MessageTypes,
    RemoveRecipeMessage,
    UIMessage,
} from "./messaging";
import { PluginNode } from "./node";
import { RecipeDefinition, RecipeRegistry, RecipeTypes } from "./recipe-registry";
import { PluginUIActiveNodeData, PluginUIProps } from "./ui";

/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environment,
 * relying on the abstract properties and methods to supply the implementation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
export abstract class Controller {
    public recipeRegistry: RecipeRegistry = new RecipeRegistry();

    /**
     * Track the currently selected node.
     */
    private _selectedNode: string[];

    /**
     * Retrieve a plugin Node by ID. Return null if no node by the provided ID exists
     * @param id The ID of the node
     */
    public abstract getNode(id: string): PluginNode | null;

    /**
     * Retrieve the selected node ID
     */
    public getSelectedNodes(): string[] {
        return this._selectedNode;
    }

    /**
     * Set the selected node ID - setting the ID will trigger
     * a UI refresh
     * @param ids the node IDs
     */
    public setSelectedNodes(ids: string[]): void {
        this._selectedNode = ids;

        // Queue update
        this.setPluginUIState(this.getPluginUIState());
    }

    /**
     * Retrieve the UI state
     */
    public getPluginUIState(): Omit<PluginUIProps, "dispatch"> {
        const selectedNodes = this.getSelectedNodes()
            .map((id: string) => this.getNode(id))
            .filter((node: PluginNode | null): node is PluginNode => node !== null);
        const allSupported = Array.from(
            new Set(
                selectedNodes
                    .map((node: PluginNode) => node.supports())
                    .reduce(
                        (
                            prev: (RecipeTypes | "designSystem")[],
                            next: (RecipeTypes | "designSystem")[]
                        ) => prev.concat(next),
                        []
                    )
            )
        );

        return {
            selectedNodes: selectedNodes.map(
                (node: PluginNode): PluginUIActiveNodeData => ({
                    id: node.id,
                    type: node.type,
                    supports: node.supports(),
                    recipes: node.recipes,
                    designSystem: node.designSystemOverrides,
                })
            ),
            recipeOptions: selectedNodes.length
                ? allSupported
                      .filter(
                          (type: RecipeTypes): type is RecipeTypes => !!RecipeTypes[type]
                      )
                      .map((type: RecipeTypes) => {
                          return {
                              type,
                              options: this.recipeRegistry.find(type).map(
                                  (item: RecipeDefinition<any>) =>
                                      this.recipeRegistry.toData(
                                          item.id,
                                          selectedNodes[0]
                                      ) // TODO: We probably shouldn't hard-code this, but what color do we display if there are multiple nodes?
                              ),
                          };
                      })
                : [],
        };
    }

    public handleMessage(message: UIMessage): void {
        switch (message.type) {
            case MessageTypes.recipe:
                message.action === MessageAction.assign
                    ? this.assignRecipe(message)
                    : this.removeRecipe(message);
                break;
            case MessageTypes.designSystem:
                this.handleDesignSystemMessage(message);
                break;
            case MessageTypes.reset:
                message.nodeIds
                    .map((id: string) => this.getNode(id))
                    .filter((node: PluginNode): node is PluginNode => node !== null)
                    .forEach((node: PluginNode) => {
                        // Delete design system
                        Object.keys(node.designSystemOverrides).map((key: string) => {
                            node.deleteDesignSystemProperty(
                                key as keyof typeof node.designSystemOverrides
                            );
                        });

                        node.recipes = [];
                    });
                this.setPluginUIState(this.getPluginUIState());

                break;
            case MessageTypes.sync:
                message.nodeIds.forEach((id: string) => this.paintTree(id));
                this.setPluginUIState(this.getPluginUIState());
                break;
        }
    }

    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract setPluginUIState(state: Omit<PluginUIProps, "dispatch">): void;

    private handleDesignSystemMessage(message: DesignSystemMessage): void {
        const nodes = message.nodeIds
            .map((id: string) => this.getNode(id))
            .filter((node: PluginNode): node is PluginNode => node !== null);

        switch (message.action) {
            case MessageAction.assign:
                nodes.forEach((node: PluginNode) =>
                    node.setDesignSystemProperty(message.property, message.value)
                );
                break;
            case MessageAction.delete:
                nodes.forEach((node: PluginNode) =>
                    node.deleteDesignSystemProperty(message.property)
                );
                break;
        }

        nodes.forEach((node: PluginNode) => this.paintTree(node.id));

        this.setPluginUIState(this.getPluginUIState());
    }

    private removeRecipe(message: RemoveRecipeMessage): void {
        message.nodeIds
            .map((id: string) => this.getNode(id))
            .filter((node: PluginNode): node is PluginNode => node !== null)
            .forEach((node: PluginNode) => {
                node.recipes = node.recipes.filter(
                    (id: string) =>
                        this.recipeRegistry.get(id).type !== message.recipeType
                );
            });

        this.setPluginUIState(this.getPluginUIState());
    }

    private assignRecipe(message: AssignRecipeMessage): void {
        message.nodeIds.forEach((id: string) => {
            const node = this.getNode(id);

            if (!node) {
                return;
            }

            const recipe = this.recipeRegistry.get((message as any).id);

            switch (message.action) {
                case MessageAction.assign:
                    node.recipes = node.recipes
                        .filter(
                            (recipeId: string) =>
                                this.recipeRegistry.get(recipeId).type !== recipe.type
                        )
                        .concat(recipe.id);
                    break;
            }

            switch (recipe.type) {
                case RecipeTypes.backgroundFills:
                    this.paintTree(node.id);
                    break;
                case RecipeTypes.foregroundFills:
                case RecipeTypes.strokeFills:
                    node.paint(this.recipeRegistry.toData(recipe.id, node));
                    break;
            }
        });

        this.setPluginUIState(this.getPluginUIState());
    }

    private paintTree(id: string): void {
        const node = this.getNode(id);

        if (!node) {
            return;
        }

        // Paint all recipes of the node
        node.recipes.forEach((recipeId: string) => {
            node.paint(this.recipeRegistry.toData(recipeId, node));
        });

        node.children().forEach((child: PluginNode) => {
            if (node) {
                this.paintTree(child.id);
            }
        });
    }
}
