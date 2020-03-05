export const itemsKeyword: string = "items";

export enum DataType {
    number = "number",
    string = "string",
    boolean = "boolean",
    array = "array",
    null = "null",
    object = "object",
    unknown = "unknown",
}

export enum PropertyKeyword {
    properties = "properties",
    additionalProperties = "additionalProperties",
}

export enum CombiningKeyword {
    anyOf = "anyOf",
    oneOf = "oneOf",
    allOf = "allOf",
}

export enum ItemConstraints {
    minItems = "minItems",
    maxItems = "maxItems",
}
