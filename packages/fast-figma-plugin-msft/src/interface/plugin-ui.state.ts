import {
    getFillRecipeNames,
    getStrokeRecipeNames,
    getTextFillRecipeNames,
} from "../color-recipies";
import { setUIStateDataMessageCreator } from "../messaging/canvas";
import { getPluginData } from "../plugin-data";
import { canHaveFill, canHaveStroke, canHaveTextFill } from "../utilities/node";

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
    fills: string[];

    /**
     * The currently active fill if any, otherwise null
     */
    activeFill: string;

    /**
     * The set of strokes available to the node
     */
    strokes: string[];

    /**
     * The currently active stroke if any, otherwise null
     */
    activeStroke: string;

    /**
     * The set of text fills available to the node
     */
    textFills: string[];

    /**
     * The currently active textFill if any, otherwise null
     */
    activeTextFill: string;
}

const defaultState: PluginUIState = {
    activeNodeType: null,
    activeFill: "",
    activeStroke: "",
    activeTextFill: "",
    fills: [],
    strokes: [],
    textFills: [],
};

/**
 * Derives a stage object to provide to the Plugin UI.
 */
export async function getPluginUIState(node: SceneNode | null): Promise<PluginUIState> {
    if (node === null) {
        return defaultState;
    } else {
        return {
            activeNodeType: node.type,
            activeFill: getPluginData(node, "fill"),
            activeStroke: getPluginData(node, "stroke"),
            activeTextFill: getPluginData(node, "textFill"),
            fills: canHaveFill(node) ? [""].concat(await getFillRecipeNames()) : [],
            strokes: canHaveStroke(node) ? [""].concat(await getStrokeRecipeNames()) : [],
            textFills: canHaveTextFill(node)
                ? [""].concat(await getTextFillRecipeNames())
                : [],
        };
    }
}

/**
 * Derives the UI state and sends the state object to the Plugin UI
 */
export function setPluginUIState(stateResolver: Promise<PluginUIState>): void {
    stateResolver
        .then(
            (state: PluginUIState): void => {
                figma.ui.postMessage(setUIStateDataMessageCreator(state));
            }
        )
        .catch((reason: any) => {
            // tslint:disable-next-line
            console.warn("Plugin UI data could not be set");
        });
}
