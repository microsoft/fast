import { PluginNode, PluginNodeData, RecipeData } from "./node";
import { PluginUIProps, PluginUISelectedNodeData } from "./ui";
import { RecipeResolver } from "./recipe-resolver";
import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";

/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environment,
 * relying on the abstract properties and methods to supply the implementation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
export abstract class Controller {
    private defaultDesignSystem: DesignSystem = DesignSystemDefaults;

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
        return {
            selectedNodes: await this.getSelectedNodesPluginUIData(),
        };
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

    /**
     * Retrieve node data to provide to UI for all selected nodes
     */
    private async getSelectedNodesPluginUIData(): Promise<PluginUISelectedNodeData[]> {
        const nodes = this.getSelectedNodes()
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null);

        const results: PluginUISelectedNodeData[] = [];

        for (const node of nodes) {
            // const recipeNames = await this.recipeResolver.getRecipeNames(node);
            // const fillOptions = await Promise.all<RecipeData>(
            //     recipeNames.fills.map(
            //         async name => {
            //             return {
            //                 name,
            //                 value: await this.recipeResolver.evaluate(node, name)
            //             }
            //         }
            //     )
            // );
            const recipes = await this.getPluginUIRecipeData(node);

            const result: PluginUISelectedNodeData = {
                id: node.id,
                type: node.type,
                fills: node.getPluginData("fills"),
                strokes: node.getPluginData("strokes"),
                ...recipes,
                designSystem: node.getPluginData("designSystem"),
            };

            results.push(result);
        }

        return results;
    }

    private async getPluginUIRecipeData(node: PluginNode): Promise<any> {
        const recipeNames = await this.recipeResolver.getRecipeNames(node);

        // return Promise.all(Object.assign(recipeNames).map(async type => {
        //     return { [type]: await Promise.all(recipeNames[type].map(async name => ({
        //         name,
        //         value: this.recipeResolver.evaluate(node, name)
        //     })))}
        // })) as any;

        const fillOptions = await Promise.all<RecipeData>(
            recipeNames.fills.map(async name => {
                return {
                    name,
                    value: await this.recipeResolver.evaluate(node, name),
                };
            })
        );
    }

    private async mapNodeDataToUIData(
        node: PluginNode
    ): Promise<Partial<PluginNodeData>> {
        // const supportedProperties = node.supports();
        // const result: Partial<PluginNodeData> = {};

        // for (const prop of supportedProperties) {
        //     switch (prop) {
        //         case "backgroundFills":
        //         case "strokeFills":
        //         case "textFills":
        //             const recipeNames = await this.recipeResolver.getRecipeNames(prop);
        //             const values: RecipeData[] = [];
        //             const selected: string[] = node
        //                 .getPluginData(prop)
        //                 .map(value => value.name);

        //             for (const name of recipeNames) {
        //                 values.push({
        //                     name,
        //                     active: false,
        //                     value: await this.recipeResolver.evalute(
        //                         prop,
        //                         name,
        //                         node.designSystem()
        //                     ),
        //                 });
        //             }

        //             /**
        //              * If any of the recipes styles exist as plugin data on the node, we need to
        //              * set those as active
        //              */
        //             result[prop] = values.map(
        //                 value =>
        //                     selected.includes(value.name)
        //                         ? { ...value, active: true }
        //                         : value
        //             );
        //             break;
        //         default:
        //             result[prop] = node.getPluginData(prop);
        //     }
        // }

        // return result;
        return {} as any;
    }
}
