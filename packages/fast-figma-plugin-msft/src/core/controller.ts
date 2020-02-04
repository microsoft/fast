import { PluginNode, PluginNodeData } from "./node";
import { PluginUIProps, PluginUIPropsNodeRecipeOptions } from "./ui";
import { RecipeResolver } from "./recipe-resolver";

/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environment,
 * relying on the abstract properties and methods to supply the implementation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
export abstract class Controller {
    /**
     * Track the currently selected node.
     */
    private _selectedNode: string[];
    constructor(private recipeResolver: RecipeResolver) {}

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
    public async setSelectedNodes(ids: string[]): Promise<void> {
        this._selectedNode = ids;

        // Queue update
        this.setPluginUIState(await this.getPluginUIState());
    }

    /**
     * Retrieve the UI state
     */
    public async getPluginUIState(): Promise<PluginUIProps> {
        const selectedNodes = this.getSelectedNodes()
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null);

        const options = await Promise.all(
            selectedNodes.map(async node => ({
                id: node.id,
                options: await this.recipeResolver.recipeDataForNode(node),
            }))
        );

        return {
            selectedNodes: selectedNodes.map(
                (node): PluginNodeData => ({
                    id: node.id,
                    type: node.type,
                    contextOverrides: node.contextOverrides(),
                })
            ),
            recipeOptions: options.reduce(
                (prev, current) => ({
                    ...prev,
                    [current.id]: current.options,
                }),
                {}
            ),
        };
    }

    /**
     * Update data on individual node
     */
    public setNodeProperty(ids: string[], updates: Partial<PluginNodeData>): void {}

    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract setPluginUIState(state: PluginUIProps): void;
}
