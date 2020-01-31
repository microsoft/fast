import {
    isComponentNode,
    isFrameNode,
    isInstanceNode,
    isPolygonNode,
    isRectangleNode,
    isStarNode,
    isTextNode,
} from "./utilities/node";
import { ColorRecipeType } from "./color-recipies";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

/**
 * Describes the data stored by the plugin with https://www.figma.com/plugin-docs/api/properties/nodes-setplugindata/
 */
export interface PluginData
    extends Record<ColorRecipeType, null | { name: string; value: string }> {
    designSystem: Partial<DesignSystem> | null;
}

const data: Record<keyof PluginData, void> = {
    backgroundFill: void 0,
    strokeFill: void 0,
    textFill: void 0,
    designSystem: void 0,
};

/**
 * An array of all plugin data keys
 */
export const pluginDataKeys: string[] = ((
    d: Record<keyof PluginData, void>
): Array<keyof PluginData> => Object.keys(data) as any)({
    backgroundFill: void 0,
    strokeFill: void 0,
    textFill: void 0,
    designSystem: void 0,
});

/**
 * Light wrapper around the Figma getPluginData and setPluginData API to provide type safety
 */
export function getPluginData(
    node: PluginDataNode,
    key: "designSystem"
): PluginData["designSystem"];
export function getPluginData<T extends Exclude<keyof PluginData, "designSystem">>(
    node: PluginDataNode,
    key: T
): PluginData[T];
export function getPluginData(
    node: PluginDataNode,
    key: keyof PluginData
): PluginData[keyof PluginData] {
    const raw = node.getPluginData(key);

    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

export function setPluginData(
    node: PluginDataNode,
    key: "designSystem",
    value: PluginData["designSystem"]
): void;
export function setPluginData(
    node: PluginDataNode,
    key: Exclude<keyof PluginData, "designSystem">,
    value: PluginData[Exclude<keyof PluginData, "designSystem">]
): void;
export function setPluginData(
    node: PluginDataNode,
    key: keyof PluginData,
    value: PluginData[keyof PluginData]
): void {
    node.setPluginData(key, value === null ? "" : JSON.stringify(value));
}

export type FillRecipeNode = FrameNode | RectangleNode | PolygonNode | StarNode;
export type StrokeRecipeNode = FillRecipeNode;
export type TextFillRecipeNode = TextNode;
export type DesignSystemNode = FillRecipeNode;
export type PluginDataNode =
    | FillRecipeNode
    | StrokeRecipeNode
    | TextFillRecipeNode
    | DesignSystemNode;

/**
 * Test if a node supports a type of data
 */
export function supports(node: BaseNode, type: "designSystem"): node is DesignSystemNode;
export function supports(node: BaseNode, type: "backgroundFill"): node is FillRecipeNode;
export function supports(node: BaseNode, type: "strokeFill"): node is StrokeRecipeNode;
export function supports(node: BaseNode, type: "textFill"): node is TextNode;
export function supports(node: BaseNode, type: keyof PluginData): node is PluginDataNode {
    switch (type) {
        case "backgroundFill":
        case "strokeFill":
        case "designSystem":
            return [
                isFrameNode,
                isRectangleNode,
                isPolygonNode,
                isStarNode,
                isComponentNode,
                isInstanceNode,
            ].some((test: (node: BaseNode) => boolean) => test(node));
        case "textFill":
            return isTextNode(node);
    }
}

export function supportsPluginData(node: BaseNode): node is PluginDataNode {
    return pluginDataKeys.some(
        (key: keyof PluginData): boolean => supports(node, key as any)
    );
}
