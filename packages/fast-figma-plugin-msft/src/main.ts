import { getPluginUIState, setPluginUIState } from "./interface/plugin-ui.state";
import {
    REMOVE_DESIGN_SYSTEM_PROPERTY,
    REMOVE_PLUGIN_DATA,
    SET_DESIGN_SYSTEM_PROPERTY,
    SET_FILL_RECIPE,
    SET_STROKE_RECIPE,
    SET_TEXT_FILL_RECIPE,
    UIMessage,
} from "./messaging/ui";
import {
    FillRecipeNode,
    getPluginData,
    PluginData,
    pluginDataKeys,
    PluginDataNode,
    setPluginData,
    StrokeRecipeNode,
    supports,
    supportsPluginData,
    TextFillRecipeNode,
} from "./plugin-data";
import { canHaveChildren, getActiveNode } from "./utilities/node";
import { getDesignSystem } from "./utilities/design-system";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";
import { ColorRecipeType, getRecipeValue } from "./color-recipies";
import { painter, PaintOperation } from "./utilities/paint";

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

async function onMessage(message: UIMessage): Promise<void> {
    const node: SceneNode | null = getActiveNode();

    /**
     * If we somehow get into a state where we're setting properties on an invalid selection,
     * we shouldn't save any changes.
     */
    if (node === null) {
        return;
    }

    if (message.type === SET_FILL_RECIPE && supports(node, "backgroundFill")) {
        await setBackgroundFill(node, message.value);
        await updateTree(node);
    } else if (message.type === SET_TEXT_FILL_RECIPE && supports(node, "textFill")) {
        await setTextFill(node, message.value);
    } else if (message.type === SET_STROKE_RECIPE && supports(node, "strokeFill")) {
        await setStrokeFill(node, message.value);
    } else if (message.type === REMOVE_PLUGIN_DATA) {
        removeDataFromTree(node);
    } else if (
        message.type === SET_DESIGN_SYSTEM_PROPERTY &&
        supports(node, "designSystem")
    ) {
        const data = getPluginData(node, "designSystem");
        setPluginData(node, "designSystem", (!!data
            ? { ...data, ...message.value }
            : message.value) as Partial<DesignSystem>);
        updateTree(node);
    } else if (
        message.type === REMOVE_DESIGN_SYSTEM_PROPERTY &&
        supports(node, "designSystem")
    ) {
        const data = getPluginData(node, "designSystem");

        if (data && data.hasOwnProperty(message.value)) {
            delete data[message.value];
            const value = Object.keys(data).length ? data : null;

            setPluginData(node, "designSystem", value);
            updateTree(node);
        }
    }

    // Sync plugin UI with node state and paint changed nodes
    setPluginUIState(getPluginUIState(node));
    painter.paint();
}

function simpleRecipeSetter<T extends PluginDataNode>(
    type: ColorRecipeType
): (node: T, name: string) => Promise<void> {
    return async (node: T, name: string): Promise<void> => {
        try {
            const value: string = await getRecipeValue(type, name, getDesignSystem(node));
            setPluginData(node, type, { name, value });
            painter.queue(new PaintOperation(node.id, type));
        } catch (e) {
            // If we can't resolve the recipe
            setPluginData(node, type, null);
        }
    };
}

const setTextFill = simpleRecipeSetter<TextFillRecipeNode>("textFill");
const setStrokeFill = simpleRecipeSetter<StrokeRecipeNode>("strokeFill");

async function setBackgroundFill(node: FillRecipeNode, name: string): Promise<void> {
    const type: ColorRecipeType = "backgroundFill";
    // We have an augmented design-system here because we want design-system overrides
    // on the node itself to be reflected on the recipe,
    // but the bg context of the recipe should still be the parent, otherwise
    // changes to the recipe will always be relative to the previously applied recipe
    const designSystem: DesignSystem = {
        ...getDesignSystem(node),
        backgroundColor: getDesignSystem(node.parent, "backgroundColor").backgroundColor,
    };

    try {
        const value: string = await getRecipeValue(type, name, designSystem);
        const designSystemData = getPluginData(node, "designSystem");
        setPluginData(node, type, { name, value });
        setPluginData(
            node,
            "designSystem",
            designSystemData
                ? { ...designSystemData, backgroundColor: value }
                : { backgroundColor: value }
        );
        painter.queue(new PaintOperation(node.id, type));
    } catch (e) {
        // If we can't resolve the recipe
        setPluginData(node, type, null);
    }
}

/**
 * Updates all nodes recursively, re-evaluating any nodes with
 * recipes assigned
 */
async function updateTree(node: BaseNode): Promise<void> {
    if (supportsPluginData(node)) {
        const fill = getPluginData(node, "backgroundFill");
        const stroke = getPluginData(node, "strokeFill");
        const textFill = getPluginData(node, "textFill");

        if (supports(node, "backgroundFill") && fill && fill.name) {
            await setBackgroundFill(node, fill.name);
        }

        if (supports(node, "strokeFill") && stroke && stroke.name) {
            await setStrokeFill(node, stroke.name);
        }

        if (supports(node, "textFill") && textFill && textFill.name) {
            await setTextFill(node, textFill.name);
        }
    }
    if (canHaveChildren(node)) {
        for (const child of node.children) {
            await updateTree(child);
        }
    }

    return;
}

/**
 * Sets all plugin data keys to an empty string, which is the default
 * value returned from Figma when no data under a key is set.
 *
 * This is mostly for development purposes, getting back to a clean data
 * state
 * @param node The node to begin plugin data purge
 */
function removeDataFromTree(node: BaseNode): void {
    if (supportsPluginData(node)) {
        pluginDataKeys.forEach(
            (key: keyof PluginData): void => {
                setPluginData(node, key as any, null);
            }
        );
    }

    if (canHaveChildren(node)) {
        node.children.forEach(removeDataFromTree);
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
