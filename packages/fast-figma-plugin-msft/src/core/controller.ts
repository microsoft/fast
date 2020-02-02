import { PluginUIProps } from "./ui";
import { PluginNode, PluginNodeData } from "./node";

/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environemnt,
 * relying on the abstract properties and methods to supply the implmenation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
export abstract class Controller {
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
        try {
            this.setPluginUIState(await this.getPluginUIState());
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Retrieve the UI state
     */
    public async getPluginUIState(): Promise<PluginUIProps> {
        const selectedIds = this.getSelectedNodes();
        const selectedNodes = selectedIds
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null);

        const suportedPropertyIntersection = this.getSupportedPropertyIntersection(
            selectedIds
        );

        /**
         * Determine availible recipes:
         * 1. for each node, determine which recipe types can be set on the node.
         * 2. filter sets to the intersection of recipe types
         * 3. construct recipe data object
         */
        return {
            selectedNodes: selectedIds,
            selectedNodeTypes: selectedNodes.map(node => node.type),
            editableProperties: suportedPropertyIntersection.map(key => {
                return { type: key, label: "TEST", options: [] } as any;
            }), // TODO: retrieve recipes from node
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
     * get intersection of supported properties of selected nodes
     */
    private getSupportedPropertyIntersection(ids: string[]): Array<keyof PluginNodeData> {
        const supports = ids
            .map(id => this.getNode(id))
            .filter((node): node is PluginNode => node !== null)
            .map(node => node.supports());

        const unique = Array.from(
            new Set(
                supports.length
                    ? supports.reduce((prev, current) => prev.concat(current))
                    : []
            )
        );

        return unique.filter(key => {
            return supports.every(set => set.includes(key));
        });
    }

    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract setPluginUIState(state: PluginUIProps): void;
}

/**
 * You're here - how do we do events?
 */
enum PluginUIEventType {
    update,
    delete,
}

interface PluginUIEvent {
    type: PluginUIEventType;
}

interface PluginUIUpdateEvent extends PluginUIEvent {
    type: typeof PluginUIEventType.update;
    value: Partial<PluginNodeData>;
}
