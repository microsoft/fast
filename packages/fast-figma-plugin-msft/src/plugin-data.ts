import { getPluginUIState, setPluginUIState } from "./interface/plugin-ui.state";
import { getDesignSystem } from "./utilities/design-system";
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

/**
 * Describes the data stored by the plugin with https://www.figma.com/plugin-docs/api/properties/nodes-setplugindata/
 */
export type PluginData = Record<ColorRecipeType, string>;

/**
 * Light wrapper around the Figma getPluginData and setPluginData API to provide type safety
 */
export function getPluginData<T extends keyof PluginData>(
    node: PluginDataNode,
    key: T
): PluginData[T] {
    return node.getPluginData(key);
}

export function setPluginData<T extends keyof PluginData>(
    node: PluginDataNode,
    key: T,
    value: PluginData[T]
): void {
    node.setPluginData(key, value);
}

export type FillRecipeNode = FrameNode | RectangleNode | PolygonNode | StarNode;
export type StrokeRecipeNode = FillRecipeNode;
export type TextFillRecipeNode = TextNode;
export type PluginDataNode = FillRecipeNode | StrokeRecipeNode | TextFillRecipeNode;

/**
 * Test if a node supports a type of data
 */
export function supports(node: BaseNode, type: "backgroundFill"): node is FillRecipeNode;
export function supports(node: BaseNode, type: "strokeFill"): node is StrokeRecipeNode;
export function supports(node: BaseNode, type: "textFill"): node is TextFillRecipeNode;
export function supports(node: BaseNode, type: keyof PluginData): boolean {
    return type === "backgroundFill" || type === "strokeFill"
        ? [
              isComponentNode,
              isFrameNode,
              isInstanceNode,
              isRectangleNode,
              isPolygonNode,
              isStarNode,
          ].some((test: (node: BaseNode) => boolean) => test(node))
        : isTextNode(node);
}

export function supportsPluginData(node: BaseNode): node is PluginDataNode {
    return (
        supports(node, "backgroundFill") ||
        supports(node, "strokeFill") ||
        supports(node, "textFill")
    );
}
