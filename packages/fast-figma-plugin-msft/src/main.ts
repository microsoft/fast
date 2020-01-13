import { getPluginData, setPluginData } from "./plugin-data";
import { setUIStateDataMessageCreator } from "./messaging/canvas";
import { PluginUIState, PluginUIStateStore } from "./interface/plugin-ui.state";
import {
    SET_FILL_RECIPE,
    SET_STROKE_RECIPE,
    SET_TEXT_FILL_RECIPE,
    SetFillRecipeData,
    SetStrokeRecipeData,
    SetTextFillRecipeData,
} from "./messaging/ui";

/**
 * Show UI on plugin launch
 */
figma.showUI(__html__, {
    height: 600,
});

/**
 * Main plugin file responsible for Figma document manipulation.
 * This file has full access to the Figma API.
 */

const pluginUIStateStore: PluginUIStateStore = new PluginUIStateStore(
    (state: PluginUIState): void => {
        figma.ui.postMessage(setUIStateDataMessageCreator(state));
    }
);

/**
 * Returns the selected node if a single node is
 * selected, otherwise returns null
 */
function getActiveNode(): SceneNode | null {
    const { selection }: typeof figma.currentPage = figma.currentPage;

    return selection.length === 1 ? selection[0] : null;
}

/**
 * Handles node selection changes.
 */
function onSelectionChange(): void {
    const node: SceneNode | null = getActiveNode();

    // Limit showing UI to when a single node is selected.
    pluginUIStateStore.activeNodeType = node === null ? null : node.type;

    if (node !== null) {
        // Check node for plugin data and ensure UI represents that state
        const fill = getPluginData(node, "fill");
        const textFill = getPluginData(node, "textFill");
        const stroke = getPluginData(node, "stroke");

        if (fill !== pluginUIStateStore.activeFill) {
            pluginUIStateStore.activeFill = fill;
        }

        if (textFill !== pluginUIStateStore.activeTextFill) {
            pluginUIStateStore.activeTextFill = textFill;
        }

        if (stroke !== pluginUIStateStore.activeStroke) {
            pluginUIStateStore.activeStroke = stroke;
        }
    }
}

function onMessage(
    message: SetFillRecipeData | SetTextFillRecipeData | SetStrokeRecipeData
): void {
    const currentNode: SceneNode | null = getActiveNode();

    /**
     * If we somehow get into a state where we're setting properties on an invalid selection,
     * we shouldn't save any changes.
     */
    if (currentNode === null) {
        return;
    }

    switch (message.type) {
        case SET_FILL_RECIPE:
            pluginUIStateStore.activeFill = message.value;
            setPluginData(currentNode, "fill", message.value);
            break;
        case SET_TEXT_FILL_RECIPE:
            pluginUIStateStore.activeTextFill = message.value;
            setPluginData(currentNode, "textFill", message.value);
            break;
        case SET_STROKE_RECIPE:
            pluginUIStateStore.activeStroke = message.value;
            setPluginData(currentNode, "stroke", message.value);
            break;
    }
}

// Manually trigger selection change flow when UI launches.
onSelectionChange();

/**
 * If plugin is launched and no editable node is selected, all editing UI should be disabled
 * If node is editable, fields should be enabled. If there is a current selection then the
 *    the UI should be set to that by default
 */
figma.on("selectionchange", onSelectionChange);
figma.ui.onmessage = onMessage;
