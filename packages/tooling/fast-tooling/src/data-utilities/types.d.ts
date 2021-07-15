export declare const itemsKeyword: string;
export declare enum DataType {
    number = "number",
    string = "string",
    boolean = "boolean",
    array = "array",
    null = "null",
    object = "object",
    unknown = "unknown",
}
export declare enum PropertyKeyword {
    properties = "properties",
    additionalProperties = "additionalProperties",
}
export declare enum CombiningKeyword {
    anyOf = "anyOf",
    oneOf = "oneOf",
    allOf = "allOf",
}
export declare enum ItemConstraints {
    minItems = "minItems",
    maxItems = "maxItems",
}
export declare enum ReservedElementMappingKeyword {
    mapsToSlot = "mapsToSlot",
    mapsToTagName = "mapsToTagName",
    mapsToAttribute = "mapsToAttribute",
}
/**
 * The attributes belonging to an element
 */
export interface ElementAttribute {
    name: string;
    type: DataType;
    description: string;
    default: string;
    required: boolean;
}
/**
 * The slots belonging to an element
 */
export interface ElementSlot {
    name: string;
    description: string;
}
/**
 * The individual element identified by tag name
 */
export interface ElementByTagName {
    name: string;
    description: string;
    attributes: ElementAttribute[];
    slots: ElementSlot[];
}
/**
 * The dictionary of available elements
 */
export interface ElementDictionary {
    version: number;
    tags?: ElementByTagName[];
}
