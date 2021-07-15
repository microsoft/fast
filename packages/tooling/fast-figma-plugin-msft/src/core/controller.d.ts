import { UIMessage } from "./messaging";
import { PluginNode } from "./node";
import { RecipeRegistry } from "./recipe-registry";
import { PluginUIProps } from "./ui";
/**
 * Controller class designed to handle the business logic of the plugin.
 * The controller is designed to be agnostic to the design environment,
 * relying on the abstract properties and methods to supply the implementation
 * details that might exist for the eco system it is being run in. (Figma, Sketch, etc)
 */
export declare abstract class Controller {
    recipeRegistry: RecipeRegistry;
    /**
     * Track the currently selected node.
     */
    private _selectedNode;
    /**
     * Retrieve a plugin Node by ID. Return null if no node by the provided ID exists
     * @param id The ID of the node
     */
    abstract getNode(id: string): PluginNode | null;
    /**
     * Retrieve the selected node ID
     */
    getSelectedNodes(): string[];
    /**
     * Set the selected node ID - setting the ID will trigger
     * a UI refresh
     * @param ids the node IDs
     */
    setSelectedNodes(ids: string[]): void;
    /**
     * Retrieve the UI state
     */
    getPluginUIState(): Omit<PluginUIProps, "dispatch">;
    /**
     * Forces the component tree to evaluate recipes and repaint.
     * @param ids the node IDs
     */
    syncNodes(ids: string[]): void;
    handleMessage(message: UIMessage): void;
    /**
     * Provides the state object to the UI component and updates the UI
     * @param state the UI state object
     */
    protected abstract setPluginUIState(state: Omit<PluginUIProps, "dispatch">): void;
    private handleDesignSystemMessage;
    private removeRecipe;
    private assignRecipe;
    private paintTree;
}
