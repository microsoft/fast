/**
 * Describes the data stored by the plugin with https://www.figma.com/plugin-docs/api/properties/nodes-setplugindata/
 * TODO are we going to need different information for different types of nodes? How does this impact these
 * assessors and setters?
 */
export type FillNames = "accent";

export interface PluginData {
    fillName?: FillNames;
}

/**
 * Light wrapper around the Figma getPluginData and setPluginData API to provide type safety
 */
export function getPluginData<KEY extends keyof PluginData, NODE extends BaseNodeMixin>(
    node: NODE,
    key: KEY
): PluginData[KEY] | undefined {
    return node.getPluginData(key) as PluginData[KEY];
}

export function setPluginData<KEY extends keyof PluginData, NODE extends BaseNodeMixin>(
    node: NODE,
    key: KEY,
    value: PluginData[KEY]
): void {
    node.setPluginData(key, value);
}
