import { Plugin, PluginProps } from "./plugin";

export const typeKeyword: string = "type";
export const pluginIdKeyword: string = "pluginId";
export const propsKeyword: string = "props";
export const idKeyword: string = "id";

export enum DataResolverType {
    plugin = "plugin",
    component = "component",
}

export enum DataType {
    number = "number",
    string = "string",
    boolean = "boolean",
    array = "array",
    null = "null",
    object = "object",
    children = "children",
}

export enum PropertyKeyword {
    properties = "properties",
    reactProperties = "reactProperties",
}

export enum CombiningKeyword {
    anyOf = "anyOf",
    oneOf = "oneOf",
    allOf = "allOf",
}

export interface PluginLocation {
    /**
     * The data location to be interpreted by the plugin
     */
    dataLocation: string;

    /**
     * The type of data this represents
     */
    type: DataType;

    /**
     * The mapping type
     */
    mappingType: DataResolverType.plugin;

    /**
     * The data location of the data
     * relative to the schema
     */
    relativeDataLocation: string;

    /**
     * The schema related to the data location
     */
    schema: any;
}

export interface ChildrenLocation {
    /**
     * The data location of the child component
     */
    dataLocation: string;

    /**
     * The mapping type
     */
    mappingType: DataResolverType.component;
}

export type MappedDataLocation = PluginLocation | ChildrenLocation;

export interface ChildOptionItem {
    /**
     * The name of the component
     */
    name?: string;

    /**
     * The React component
     */
    component: React.ComponentType;

    /**
     * The JSON schema for the component
     */
    schema: any;
}

export interface PluginResolverDataMap {
    /**
     * Data location for the resolved data
     */
    dataLocation: string;

    /**
     * Resolved data
     */
    data: any;
}

export interface PluginResolverDataMapConfig {
    /**
     * Is this data React children
     */
    isReactChildren: boolean;

    /**
     * The data to supply to the plugin
     */
    pluginData: any;

    /**
     * The plugin to use to resolve the data
     */
    pluginResolver: Plugin<PluginProps>;

    /**
     * The React children to pass to the plugin
     */
    childOptions: ChildOptionItem[];

    /**
     * The data location derived from the schema location
     */
    dataLocation: string;
}
