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
        this.setPluginUIState(await this.getPluginUIState());
    }

    /**
     * Retrieve the UI state
     */
    public async getPluginUIState(): Promise<PluginUIProps> {
        const selectedNodes = this.getSelectedNodes();

        return {
            selectedNodes,
            selectedNodeTypes: selectedNodes
                .map((id: string) => this.getNode(id))
                .filter(node => !!node)
                .map(node => node!.type),
        };
    }

    /**
     * Update data on individual node
     */
    public setNodeProperty(ids: string[], updates: Partial<PluginNodeData>): void {
        ids.map(id => this.getNode(id))
            .filter(node => !!node)
            .forEach(node => {
                // We need to queue this node for painting
                for (const key in updates) {
                    node!.setPluginData(key as keyof PluginNodeData, updates[key]);
                }
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
