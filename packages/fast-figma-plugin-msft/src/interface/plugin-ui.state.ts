import { fillRecipies, strokeRecipies, textFillRecipies } from "../color-recipies";

/**
 * Define the react state object for the Plugin UI
 */
export interface PluginUIState {
    /**
     * The type of node that is currently selected
     */
    activeNodeType: NodeType | null;

    /**
     * The set of fills available to the node
     */
    fills: Array<keyof typeof fillRecipies>;

    /**
     * The currently active fill if any, otherwise null
     */
    activeFill: keyof typeof fillRecipies | null;

    /**
     * The set of strokes available to the node
     */
    strokes: Array<keyof typeof strokeRecipies>;

    /**
     * The currently active stroke if any, otherwise null
     */
    activeStroke: keyof typeof strokeRecipies | null;
}
