import { getPluginUIState, setPluginUIState } from "./interface/plugin-ui.state";
import {
    SET_FILL_RECIPE,
    SET_STROKE_RECIPE,
    SET_TEXT_FILL_RECIPE,
    SetFillRecipeData,
    SetStrokeRecipeData,
    SetTextFillRecipeData,
} from "./messaging/ui";
import {
    getPluginData,
    PluginData,
    setPluginData,
    supportsFillRecipe,
    supportsPluginData,
    supportsStrokeRecipe,
    supportsTextFillRecipe,
} from "./plugin-data";
import { canHaveChildren, getActiveNode, setFill, setStroke } from "./utilities/node";
import { getDesignSystem } from "./utilities/design-system";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { getRecipeValue } from "./color-recipies";

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

    if (message.type === SET_FILL_RECIPE && supportsFillRecipe(node)) {
        setPluginData(node, "backgroundFill", message.value);
        setPluginUIState(getPluginUIState(node));
        const hex: string = await getRecipeValue(
            "backgroundFill",
            message.value,
            designSystem
        );
        const color: ColorRGBA64 | null = parseColorHexRGB(hex);

        if (color !== null) {
            setFill(node, color);
        }

        await updateTree(node);
    } else if (message.type === SET_TEXT_FILL_RECIPE && supportsTextFillRecipe(node)) {
        setPluginData(node, "textFill", message.value);
        setPluginUIState(getPluginUIState(node));
        const hex: string = await getRecipeValue("textFill", message.value, designSystem);
        const color: ColorRGBA64 | null = parseColorHexRGB(hex);

        if (color !== null) {
            setFill(node, color);
        }
    } else if (message.type === SET_STROKE_RECIPE && supportsStrokeRecipe(node)) {
        setPluginData(node, "strokeFill", message.value);
        setPluginUIState(getPluginUIState(node));
        const hex: string = await getRecipeValue(
            "strokeFill",
            message.value,
            designSystem
        );
        const color: ColorRGBA64 | null = parseColorHexRGB(hex);

        if (color !== null) {
            setStroke(node, color);
        }
    }
}

/**
 * Re-evaluates all of the assigned recipies inside a given node.
 */
async function updateTree(node: BaseNode): Promise<void> {
    if (!canHaveChildren(node)) {
        return;
    }

    for (const child of node.children) {
        if (supportsPluginData(child)) {
            const designSystem: DesignSystem = await getDesignSystem(child);
            const fill: string = getPluginData(child, "backgroundFill");
            const stroke: string = getPluginData(child, "strokeFill");
            const textFill: string = getPluginData(child, "textFill");

            if (fill.length) {
                const hex: string = await getRecipeValue(
                    "backgroundFill",
                    fill,
                    designSystem
                );
                const color: ColorRGBA64 | null = parseColorHexRGB(hex);

                if (color !== null) {
                    setFill(child, color);
                }
            }

            if (stroke.length) {
                const hex: string = await getRecipeValue(
                    "strokeFill",
                    stroke,
                    designSystem
                );
                const color: ColorRGBA64 | null = parseColorHexRGB(hex);

                if (color !== null) {
                    setStroke(child, color);
                }
            }

            if (textFill.length) {
                const hex: string = await getRecipeValue(
                    "textFill",
                    textFill,
                    designSystem
                );
                const color: ColorRGBA64 | null = parseColorHexRGB(hex);

                if (color !== null) {
                    setFill(child, color);
                }
            }
        }

        await updateTree(child);
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
