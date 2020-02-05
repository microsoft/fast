import { PluginNode, PluginNodeData } from "./node";
import { isEvaluatableRecipeDefinition, RecipeRegistry } from "./recipe-registry";
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
    public getPluginUIState(): PluginUIProps {
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
                    recipes: node.getPluginData("recipes"),
                })
            ),
            recipeOptions: selectedNodes.length
                ? allSupported.map(type => {
                      return {
                          type: type,
                          options: this.recipeRegistry.find(type).map(
                              item =>
                                  this.recipeRegistry.toSerializable(
                                      item.id,
                                      selectedNodes[0]
                                  ) // TODO: We probably shouldn't hard-code this, but what do we do if there are multiple selected?
                          ),
                      };
                  })
                : [],
        };
    }

    /**
     * Update data on individual node
     */
    public setNodeProperty(ids: string[], updates: Partial<PluginNodeData>): void {
        // TODO
    }

    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract setPluginUIState(state: PluginUIProps): void;
}
