import { CombiningKeyword, DataType, PropertyKeyword } from "./types";
/**
 * This file contains all functionality for generating data
 */
const exampleString = "example text";
function isOneOfAnyOf(schema) {
    return schema[CombiningKeyword.oneOf] || schema[CombiningKeyword.anyOf];
}
function isObjectDataType(schema) {
    return schema.type === DataType.object || schema[PropertyKeyword.properties];
}
function hasExample(examples) {
    return Array.isArray(examples) && examples.length > 0;
}
function hasRequired(schema) {
    return Array.isArray(schema.required) && schema.required.length > 0;
}
function hasEnum(schema) {
    return Array.isArray(schema.enum);
}
function hasConst(schema) {
    return typeof schema.const !== "undefined";
}
/**
 * If there is a default value or example values,
 * return a value to use
 */
function getDefaultOrExample(schema) {
    if (typeof schema.default !== "undefined") {
        return schema.default;
    }
    if (hasExample(schema.examples)) {
        return schema.examples[0];
    }
    if (hasEnum(schema)) {
        return schema.enum[0];
    }
    if (hasConst(schema)) {
        return schema.const;
    }
}
/**
 * Gets a single example from a schema
 */
function getDataFromSchema(schema) {
    if (isOneOfAnyOf(schema)) {
        const oneOfAnyOf =
            schema[CombiningKeyword.oneOf] !== undefined
                ? CombiningKeyword.oneOf
                : CombiningKeyword.anyOf;
        return getDataFromSchema(schema[oneOfAnyOf][0]);
    }
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    return getDataFromSchemaByDataType(schema);
}
/**
 * Gets an example by the type of data
 */
function getDataFromSchemaByDataType(schema) {
    const defaultOrExample = getDefaultOrExample(schema);
    if (typeof defaultOrExample !== "undefined") {
        return defaultOrExample;
    }
    if (isObjectDataType(schema)) {
        const exampleData = {};
        if (hasRequired(schema)) {
            for (const requiredItem of schema.required) {
                exampleData[requiredItem] = getDataFromSchema(
                    schema[PropertyKeyword.properties][requiredItem]
                );
            }
        }
        return exampleData;
    }
    switch (schema.type) {
        case DataType.array: {
            const arrayData = [];
            const minItems = schema.minItems ? schema.minItems : 2;
            for (let i = 0; i < minItems; i++) {
                arrayData.push(getDataFromSchema(schema.items));
            }
            return arrayData;
        }
        case DataType.boolean:
            return true;
        case DataType.null:
            return null;
        case DataType.string:
            return exampleString;
        case DataType.number:
            return Math.round(Math.random() * 100);
    }
}
export { getDataFromSchema };
