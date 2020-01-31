import { getRecipeNames } from "../color-recipies";
import { setUIStateDataMessageCreator } from "../messaging/canvas";
import { getPluginData, supports, supportsPluginData } from "../plugin-data";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

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

    /**
     * The design system
     */
    designSystem: Partial<DesignSystem> | null;
}

export const defaultState: PluginUIState = {
    activeNodeType: null,
    activeFill: "",
    activeStroke: "",
    activeTextFill: "",
    fills: [],
    strokes: [],
    textFills: [],
    designSystem: null,
};

/**
 * Derives a stage object to provide to the Plugin UI.
 */
export async function getPluginUIState(node: SceneNode | null): Promise<PluginUIState> {
    if (node === null || !supportsPluginData(node)) {
        return defaultState;
    } else {
        const backgroundFill = getPluginData(node, "backgroundFill");
        const strokeFill = getPluginData(node, "strokeFill");
        const textFill = getPluginData(node, "textFill");

        return {
            activeNodeType: node.type,
            activeFill: backgroundFill ? backgroundFill.name : "",
            activeStroke: strokeFill ? strokeFill.name : "",
            activeTextFill: textFill ? textFill.name : "",
            fills: supports(node, "backgroundFill")
                ? [""].concat(await getRecipeNames("backgroundFill"))
                : defaultState.fills,
            strokes: supports(node, "strokeFill")
                ? [""].concat(await getRecipeNames("strokeFill"))
                : defaultState.strokes,
            textFills: supports(node, "textFill")
                ? [""].concat(await getRecipeNames("textFill"))
                : defaultState.textFills,
            designSystem: supports(node, "designSystem")
                ? getPluginData(node, "designSystem")
                : null,
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
            console.warn("Plugin UI data could not be set", reason);
        });
}
