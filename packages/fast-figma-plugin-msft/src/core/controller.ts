import { PluginNode, PluginNodeData, RecipeData } from "./node";
import { PluginUIProps, PluginUISelectedNodeData } from "./ui";
import { RecipeResolver } from "./recipe-resolver";

export type RecipeTypes = "backgroundFills" | "strokeFills" | "textFills";
export const recipeTypes: RecipeTypes[] = (() => {
    const data: Record<RecipeTypes, void> = {
        backgroundFills: void 0,
        strokeFills: void 0,
        textFills: void 0,
    };

    return Object.keys(data) as RecipeTypes[];
})();

/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environemnt,
 * relying on the abstract properties and methods to supply the implmenation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
export abstract class Controller {
    constructor(private recipeResolver: RecipeResolver) {}

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
     * Retreive the slected node ID
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
        /**
         * Determine availible recipes:
         * 1. for each node, determine which recipe types can be set on the node.
         * 2. filter sets to the intersection of recipe types
         * 3. construct recipe data object
         */

        const recipeData: Partial<RecipeData> = {};

        for (const type of recipeTypes) {
            const names = await this.recipeResolver.getRecipeNames(type);
            const values: RecipeData[] = [];

            for (const name of names) {
                const value = await this.recipeResolver.evalute(type, name, {});
                values.push({ name, value });
                // values.push(await this.recipeResolver.evalute(type as any, name as any, {} as any))
            }

            recipeData[type] = values;
        }

        return {
            selectedNodes: this.getSelectedNodePluginUIData(),
            ...(recipeData as any),
        };
    }

    /**
     * Retrieve node data to provide to UI for all selected nodes
     */
    private getSelectedNodePluginUIData(): PluginUISelectedNodeData[] {
        return this.getSelectedNodes()
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null)
            .map(
                (node): PluginUISelectedNodeData => {
                    const data = node.supports().reduce((current, next): Partial<
                        PluginNodeData
                    > => {
                        return { ...current, [next]: node.getPluginData(next) };
                    }, {});

                    return {
                        id: node.id,
                        type: node.type,
                        ...data,
                    };
                }
            );
    }

    /**
     * Update data on individual node
     */
    public setNodeProperty(ids: string[], updates: Partial<PluginNodeData>): void {
        ids.map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null)
            .forEach(node => {
                // TODO: Need to invalidate nodes and queue paints
            });
    }

    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract setPluginUIState(state: PluginUIProps): void;
}
