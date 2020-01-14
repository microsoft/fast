import { getPluginUIState, setPluginUIState } from "./interface/plugin-ui.state";
import {
    SET_FILL_RECIPE,
    SET_STROKE_RECIPE,
    SET_TEXT_FILL_RECIPE,
    SetFillRecipeData,
    SetStrokeRecipeData,
    SetTextFillRecipeData,
} from "./messaging/ui";
import { setPluginData } from "./plugin-data";
import { getActiveNode, setFill, setStroke } from "./utilities/node";
import { getDesignSystem } from "./utilities/design-system";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { getFillValue, getTextFillValue, getStrokeValue } from "./color-recipies";

/**
 * Show UI on plugin launch
 */
figma.showUI(__html__, {
    height: 600,
});

/**
 * Handles node selection changes.
 */
function onSelectionChange(): void {
    const node: SceneNode | null = getActiveNode();
    setPluginUIState(getPluginUIState(node));
}

async function onMessage(
    message: SetFillRecipeData | SetTextFillRecipeData | SetStrokeRecipeData
): Promise<void> {
    const node: SceneNode | null = getActiveNode();

    /**
     * If we somehow get into a state where we're setting properties on an invalid selection,
     * we shouldn't save any changes.
     */
    if (node === null) {
        return;
    }

    const designSystem: DesignSystem = await getDesignSystem(node);

    if (message.type === SET_FILL_RECIPE) {
        setPluginData(node, "fill", message.value);
        setPluginUIState(getPluginUIState(node));
        const hex: string = await getFillValue(message.value, designSystem);
        const color: ColorRGBA64 | null = parseColorHexRGB(hex);

        if (color !== null) {
            setFill(node as any, color);
        }
    } else if (message.type === SET_TEXT_FILL_RECIPE) {
        setPluginData(node, "textFill", message.value);
        setPluginUIState(getPluginUIState(node));
        setPluginUIState(getPluginUIState(node));
        const hex: string = await getTextFillValue(message.value, designSystem);
        const color: ColorRGBA64 | null = parseColorHexRGB(hex);

        if (color !== null) {
            setFill(node as any, color);
        }
    } else if (message.type === SET_STROKE_RECIPE) {
        setPluginData(node, "stroke", message.value);
        setPluginUIState(getPluginUIState(node));
        const hex: string = await getStrokeValue(message.value, designSystem);
        const color: ColorRGBA64 | null = parseColorHexRGB(hex);

        if (color !== null) {
            setStroke(node as any, color);
        }
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
