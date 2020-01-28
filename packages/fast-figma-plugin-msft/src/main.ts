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
    FillRecipeNode,
    getPluginData,
    PluginData,
    setPluginData,
    StrokeRecipeNode,
    supports,
    supportsPluginData,
    TextFillRecipeNode,
} from "./plugin-data";
import { canHaveChildren, getActiveNode } from "./utilities/node";
import { getDesignSystem } from "./utilities/design-system";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ColorRecipeType, getRecipeValue, paintNode } from "./color-recipies";

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

    if (message.type === SET_FILL_RECIPE && supports(node, "backgroundFill")) {
        setBackgroundFill(node, message.value);
    } else if (message.type === SET_TEXT_FILL_RECIPE && supports(node, "textFill")) {
        setTextFill(node, message.value);
    } else if (message.type === SET_STROKE_RECIPE && supports(node, "strokeFill")) {
        setStroke(node, message.value);
    }

    // Sync UI with changes
    setPluginUIState(getPluginUIState(node));
}

async function setBackgroundFill(node: FillRecipeNode, name: string): Promise<void> {
    const recipeType: ColorRecipeType = "backgroundFill";
    const parent = node.parent;
    setPluginData(node, recipeType, name);

    if (parent) {
        const designSystem: DesignSystem = getDesignSystem(parent);
        const nodeDesignSystem: Partial<DesignSystem> = getPluginData(
            node,
            "designSystem"
        );

        if (name === "") {
            // We're removing a recipe
            const removeBackground = { ...nodeDesignSystem };
            delete removeBackground.backgroundColor;

            setPluginData(node, "designSystem", {
                ...removeBackground,
            });
        } else {
            const hex: string = await getRecipeValue(recipeType, name, designSystem);

            const color: ColorRGBA64 | null = parseColorHexRGB(hex);

            if (color !== null) {
                paintNode(node, recipeType, color);
                setPluginData(node, "designSystem", {
                    ...nodeDesignSystem,
                    backgroundColor: hex,
                });
            }
        }

        await updateTree(node);
    }
}

async function setTextFill(node: TextFillRecipeNode, name: string): Promise<void> {
    const recipeType: ColorRecipeType = "textFill";
    setPluginData(node, recipeType, name);

    const hex: string = await getRecipeValue(recipeType, name, getDesignSystem(node));
    const color: ColorRGBA64 | null = parseColorHexRGB(hex);

    if (color !== null) {
        paintNode(node, recipeType, color);
    }
}

async function setStroke(node: StrokeRecipeNode, name: string): Promise<void> {
    const recipeType: ColorRecipeType = "strokeFill";
    setPluginData(node, recipeType, name);

    const hex: string = await getRecipeValue(recipeType, name, getDesignSystem(node));
    const color: ColorRGBA64 | null = parseColorHexRGB(hex);

    if (color !== null) {
        paintNode(node, recipeType, color);
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
            const fill: string = getPluginData(child, "backgroundFill");
            const stroke: string = getPluginData(child, "strokeFill");
            const textFill: string = getPluginData(child, "textFill");

            if (supports(child, "backgroundFill") && fill.length) {
                const designSystem: DesignSystem = getDesignSystem(node);
                const hex: string = await getRecipeValue(
                    "backgroundFill",
                    fill,
                    designSystem
                );
                const color: ColorRGBA64 | null = parseColorHexRGB(hex);

                if (color !== null) {
                    paintNode(child, "backgroundFill", color);
                }
            }

            if (supports(child, "strokeFill") && stroke.length) {
                const designSystem: DesignSystem = getDesignSystem(child);
                const hex: string = await getRecipeValue(
                    "strokeFill",
                    stroke,
                    designSystem
                );
                const color: ColorRGBA64 | null = parseColorHexRGB(hex);

                if (color !== null) {
                    paintNode(child, "strokeFill", color);
                }
            }

            if (supports(child, "textFill") && textFill.length) {
                const designSystem: DesignSystem = getDesignSystem(child);
                const hex: string = await getRecipeValue(
                    "textFill",
                    textFill,
                    designSystem
                );
                const color: ColorRGBA64 | null = parseColorHexRGB(hex);

                if (color !== null) {
                    paintNode(child, "textFill", color);
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
