import {
    DesignSystemMessage,
    MessageTypes,
    RecipeMessage,
    MessageAction,
    UIMessage,
} from "./messaging";
import { PluginNode } from "./node";
import { RecipeRegistry, RecipeTypes } from "./recipe-registry";
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
     * @param id the node ID
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
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null);
        const allSupported = Array.from(
            new Set(
                selectedNodes
                    .map(node => node.supports())
                    .reduce((prev, next) => prev.concat(next), [])
            )
        );

        return {
            selectedNodes: selectedNodes.map(
                (node): PluginUIActiveNodeData => ({
                    id: node.id,
                    type: node.type,
                    supports: node.supports(),
                    recipes: node.recipes,
                    designSystem: node.designSystemOverrides,
                })
            ),
            recipeOptions: selectedNodes.length
                ? allSupported
                      .filter((type): type is RecipeTypes => !!RecipeTypes[type])
                      .map(type => {
                          return {
                              type,
                              options: this.recipeRegistry.find(type).map(
                                  item =>
                                      this.recipeRegistry.toData(
                                          item.id,
                                          selectedNodes[0]
                                      ) // TODO: We probably shouldn't hard-code this, but what do we do if there are multiple selected?
                              ),
                          };
                      })
                : [],
        };
    }

    public handleMessage(message: UIMessage): void {
        switch (message.type) {
            case MessageTypes.recipe:
                this.handleRecipeMessage(message);
                break;
            case MessageTypes.designSystem:
                this.handleDesignSystemMessage(message);
                break;
            case MessageTypes.reset:
                message.nodeIds
                    .map(id => this.getNode(id))
                    .filter((node): node is PluginNode => node !== null)
                    .forEach(node => {
                        // Delete design system
                        Object.keys(node.designSystemOverrides).map(key => {
                            node.deleteDesignSystemProperty(
                                key as keyof typeof node.designSystemOverrides
                            );
                        });

                        node.recipes = [];
                    });
                this.setPluginUIState(this.getPluginUIState());

                break;
            case MessageTypes.sync:
                message.nodeIds.forEach(id => this.paintTree(id));
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
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null);

        switch (message.action) {
            case MessageAction.assign:
                nodes.forEach(node =>
                    node.setDesignSystemProperty(message.property, message.value)
                );
                break;
            case MessageAction.delete:
                nodes.forEach(node => node.deleteDesignSystemProperty(message.property));
                break;
        }

        nodes.forEach(node => this.paintTree(node.id));

        this.setPluginUIState(this.getPluginUIState());
    }

    private handleRecipeMessage(message: RecipeMessage): void {
        message.nodeIds.forEach(id => {
            const node = this.getNode(id);
            const recipe = this.recipeRegistry.get(message.id);

            if (!node) {
                return;
            }

            switch (message.action) {
                case MessageAction.assign:
                    node.recipes = node.recipes
                        .filter(
                            recipeId =>
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

        // HACK: There is a bug that when syncing a node,
        // child node's of the syncing node do not generate
        // a color that is relative to the *new* color.
        /**
         * 1. create a set of three nested nodes all with neutralFillRest
         * 2. Create a sibling node of the top-level node from step 1, apply dark theme and neutralLayerL1
         * 3. Re-parent node from step one into node of step 2.
         * 4. With the re-parented node selected, click the "sync" button
         * - only the selected node re-styles. Clicking "sync" again works as expected.
         */
        // PluginNode.purgeDesignSystemCache(node);

        // Paint all recipes of the node
        node.recipes.forEach(recipeId => {
            const recipe = this.recipeRegistry.get(recipeId);

            // TODO: We can probably be smarter about when to apply the backgroundColor property.
            // This causes us to purge sub-trees un-necessarily, because setting the property
            // automatically purges the tree.
            if (recipe.type === RecipeTypes.backgroundFills) {
                node.setDesignSystemProperty("backgroundColor", recipe.evaluate(node));
            }

            node.paint(this.recipeRegistry.toData(recipeId, node));
        });

        node.children().forEach(child => {
            if (node) {
                this.paintTree(child.id);
            }
        });
    }
}
