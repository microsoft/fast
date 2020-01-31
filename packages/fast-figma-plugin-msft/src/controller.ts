interface DesignSystem {}
interface RecipeProduct {
    name: string;
    value: string;
}

interface PluginData {
    backgrounds: RecipeProduct[];
    strokes: RecipeProduct[];
    colors: RecipeProduct[];
    designSystem: Partial<DesignSystem>;
}

interface UIState {}

/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environemnt,
 * relying on the abstract properties and methods to supply the implmenation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
abstract class Controller {
    /**
     * Retrieve a plugin Node by ID. Return null if no node by the provided ID exists
     * @param id The ID of the node
     */
    public abstract getNode(id: string): PluginNode | null;

    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract async setPluginUIState(state: UIState): Promise<void>;

    /**
     * Track the currently selected node.
     */
    private _selectedNode: string | null;

    /**
     * Retreive the slected node ID
     */
    public getSelectedNode(): string | null {
        return this._selectedNode;
    }

    /**
     * Set the selected node ID - setting the ID will trigger
     * a UI refresh
     * @param id the node ID
     */
    public async setSelectedNode(id: string | null) {
        // Queue update
        await this.setPluginUIState(this.getPluginUIState);
    }

    /**
     * Retrieve the UI state
     */
    public async getPluginUIState(): Promise<UIState> {
        return {}; // TODO: Implement
    }

    /**
     * Handle UI event
     */
    public handleUIEvent(): void;
}

interface PluginNode {
    id: string;
    getPluginData: <K extends keyof PluginData>(key: K) => PluginData[K];
    setPluginData: <K extends keyof PluginData>(key: K, value: PluginData[K]) => void;
    children: () => PluginNode[];
    supports: <K extends keyof PluginData>(key: K) => boolean;
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
    value: Partial<PluginData>;
}

const foo: PluginUIUpdateEvent = {
    type: PluginUIEventType.update,
    value: { colors: [] },
};
