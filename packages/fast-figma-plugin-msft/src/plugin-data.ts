import {
    FillRecipe,
    fillRecipies,
    StrokeRecipe,
    strokeRecipies,
    TextFillRecipe,
    textFillRecipies,
} from "./color-recipies";

/**
 * Describes the data stored by the plugin with https://www.figma.com/plugin-docs/api/properties/nodes-setplugindata/
 */

export interface PluginData {
    fill: FillRecipe | "";
    textFill: TextFillRecipe | "";
    stroke: StrokeRecipe | "";
}

/**
 * Light wrapper around the Figma getPluginData and setPluginData API to provide type safety
 */
export function getPluginData<T extends keyof PluginData>(
    node: BaseNodeMixin,
    key: T
): PluginData[T] {
    // "as any here because figma types this as a simple string, whereas we're being more strict
    return node.getPluginData(key) as any;
}

export function setPluginData<T extends keyof PluginData>(
    node: BaseNodeMixin,
    key: T,
    value: PluginData[T]
): void {
    node.setPluginData(key, value);
}
