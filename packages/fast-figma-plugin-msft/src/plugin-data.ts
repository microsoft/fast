import { getPluginUIState, setPluginUIState } from "./interface/plugin-ui.state";
import { getDesignSystem } from "./utilities/design-system";
import {
    isFrameNode,
    isPolygonNode,
    isRectangleNode,
    isStarNode,
    isTextNode,
} from "./utilities/node";

/**
 * Describes the data stored by the plugin with https://www.figma.com/plugin-docs/api/properties/nodes-setplugindata/
 */
export interface PluginData {
    fill: string;
    textFill: string;
    stroke: string;
}

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
 * Determines if a node supports a fill recipe
 */
export function supportsFillRecipe(node: BaseNode): node is FillRecipeNode {
    return [isFrameNode, isRectangleNode, isPolygonNode, isStarNode].some(
        (test: (node: BaseNode) => boolean) => test(node)
    );
}

/**
 * Determines if a node supports a stroke recipe
 */
export const supportsStrokeRecipe = supportsFillRecipe;

/**
 * Determines if a node supports a stroke recipe
 */
export const supportsTextFillRecipe = isTextNode;

export function supportsPluginData(node: BaseNode): node is PluginDataNode {
    return [supportsTextFillRecipe, supportsFillRecipe, supportsStrokeRecipe].some(
        (test: (node: BaseNode) => boolean) => test(node)
    );
}
