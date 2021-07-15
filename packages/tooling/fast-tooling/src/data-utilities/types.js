export const itemsKeyword = "items";
export var DataType;
(function (DataType) {
    DataType["number"] = "number";
    DataType["string"] = "string";
    DataType["boolean"] = "boolean";
    DataType["array"] = "array";
    DataType["null"] = "null";
    DataType["object"] = "object";
    DataType["unknown"] = "unknown";
})(DataType || (DataType = {}));
export var PropertyKeyword;
(function (PropertyKeyword) {
    PropertyKeyword["properties"] = "properties";
    PropertyKeyword["additionalProperties"] = "additionalProperties";
})(PropertyKeyword || (PropertyKeyword = {}));
export var CombiningKeyword;
(function (CombiningKeyword) {
    CombiningKeyword["anyOf"] = "anyOf";
    CombiningKeyword["oneOf"] = "oneOf";
    CombiningKeyword["allOf"] = "allOf";
})(CombiningKeyword || (CombiningKeyword = {}));
export var ItemConstraints;
(function (ItemConstraints) {
    ItemConstraints["minItems"] = "minItems";
    ItemConstraints["maxItems"] = "maxItems";
})(ItemConstraints || (ItemConstraints = {}));
export var ReservedElementMappingKeyword;
(function (ReservedElementMappingKeyword) {
    ReservedElementMappingKeyword["mapsToSlot"] = "mapsToSlot";
    ReservedElementMappingKeyword["mapsToTagName"] = "mapsToTagName";
    ReservedElementMappingKeyword["mapsToAttribute"] = "mapsToAttribute";
})(ReservedElementMappingKeyword || (ReservedElementMappingKeyword = {}));
