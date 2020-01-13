import { getPluginData, setPluginData } from "./plugin-data";
import { setUIStateDataMessageCreator } from "./messaging/canvas";
import {
    PluginUIState,
    setPluginUIState,
    getPluginUIState,
} from "./interface/plugin-ui.state";
import {
    SET_FILL_RECIPE,
    SET_STROKE_RECIPE,
    SET_TEXT_FILL_RECIPE,
    SetFillRecipeData,
    SetStrokeRecipeData,
    SetTextFillRecipeData,
} from "./messaging/ui";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { DesignSystemDefaults } from "@microsoft/fast-components-styles-msft";

/**
 * Show UI on plugin launch
 */
figma.showUI(__html__, {
    height: 600,
});

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
    setPluginUIState(getPluginUIState(node));
}

function onMessage(
    message: SetFillRecipeData | SetTextFillRecipeData | SetStrokeRecipeData
): void {
    const node: SceneNode | null = getActiveNode();

    /**
     * If we somehow get into a state where we're setting properties on an invalid selection,
     * we shouldn't save any changes.
     */
    if (node === null) {
        return;
    }

    switch (message.type) {
        case SET_FILL_RECIPE:
            setPluginData(node, "fill", message.value);
            break;
        case SET_TEXT_FILL_RECIPE:
            setPluginData(node, "textFill", message.value);
            break;
        case SET_STROKE_RECIPE:
            setPluginData(node, "stroke", message.value);
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
