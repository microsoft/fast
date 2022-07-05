import { AppliedDesignTokens, AppliedRecipes, RecipeEvaluations } from "./model";
import { PluginNode } from "./node";
import { PluginUINodeData } from "./ui/ui-controller";

export interface PluginUIState {
    selectedNodes: PluginUINodeData[];
}

/**
 * Controller class designed to handle communication between the plugin and the design tool.
 * The controller is designed to be agnostic to the design environment,
 * relying on the abstract properties and methods to supply the implementation
 * details that might exist for the ecosystem it is being run in. (Figma, Sketch, etc).
 */
export abstract class Controller {
    /**
     * Track the currently selected node.
     */
    private _selectedNodeIds: string[] = [];

    // public static nodeCount: number = 0;

    /**
     * Retrieve a Node from the design tool by ID.
     * @param id The ID of the node.
     * @returns Returns the PluginNode or null if no node by the provided ID exists.
     */
    public abstract getNode(id: string): PluginNode | null;

    /**
     * Set the selected node IDs - Setting the IDs will trigger a UI refresh.
     * @param ids The node IDs.
     */
    public setSelectedNodes(ids: string[]): void {
        this._selectedNodeIds = ids;
        // Controller.nodeCount = 0;

        // console.log("--------------------------------");
        // console.log("Controller.setSelectedNodes begin - selected nodes", ids);

        // const timeStart = new Date().getTime();

        this.setPluginUIState(this.getPluginUIState());

        // const timeEnd = new Date().getTime();
        // const timeDiff = timeEnd - timeStart;
        // console.log("Controller.setSelectedNodes end - timing", timeDiff, "node count", Controller.nodeCount);
        // console.log("--------------------------------");
    }

    private pluginNodesToUINodes(
        nodes: PluginNode[],
        includeInherited: boolean
    ): PluginUINodeData[] {
        const convertedNodes = nodes.map(
            (node): PluginUINodeData => {
                // TODO Not all children, only nodes with design tokens or recipes.
                const children = this.pluginNodesToUINodes(node.children(), false);
                const inheritedDesignTokens = includeInherited
                    ? node.inheritedDesignTokens
                    : new AppliedDesignTokens();

                return {
                    id: node.id,
                    type: node.type,
                    supports: node.supports(),
                    additionalData: node.additionalData,
                    children,
                    inheritedDesignTokens,
                    componentDesignTokens: node.componentDesignTokens,
                    componentRecipes: node.componentRecipes,
                    recipes: node.recipes as AppliedRecipes,
                    designTokens: node.localDesignTokens as AppliedDesignTokens,
                    recipeEvaluations: node.recipeEvaluations as RecipeEvaluations,
                };
            }
        );

        return convertedNodes;
    }

    private getPluginUIState(): PluginUIState {
        const selectedNodes = this._selectedNodeIds
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null);

        return {
            selectedNodes: this.pluginNodesToUINodes(selectedNodes, true),
        };
    }

    /**
     * Handle the updated nodes that are posted from the UI.
     * @param nodes The returned from the UI.
     */
    public handleMessage(nodes: PluginUINodeData[]): void {
        // console.log("--------------------------------");
        // console.log("Controller.handleMessage begin", nodes);

        // const timeStart = new Date().getTime();

        this.syncPluginNodes(nodes);

        // const timeEnd = new Date().getTime();
        // const timeDiff = timeEnd - timeStart;
        // console.log("Controller.handleMessage end - timing", timeDiff);
        // console.log("--------------------------------");
    }

    private syncPluginNodes(nodes: PluginUINodeData[]) {
        nodes.forEach(node => {
            const pluginNode = this.getNode(node.id);
            if (pluginNode) {
                pluginNode.handleManualDarkMode();
                pluginNode.setDesignTokens(node.designTokens);
                pluginNode.setRecipes(node.recipes);
                pluginNode.setRecipeEvaluations(node.recipeEvaluations);

                // Paint all recipes of the node
                pluginNode.recipeEvaluations.forEach((evaluations, recipeId) => {
                    // console.log("recipe eval", recipeId, evaluations);

                    evaluations.forEach(evaluation => {
                        pluginNode.paint(evaluation);
                    });
                });

                this.syncPluginNodes(node.children);
            }
        });
    }

    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract setPluginUIState(state: PluginUIState): void;
}
