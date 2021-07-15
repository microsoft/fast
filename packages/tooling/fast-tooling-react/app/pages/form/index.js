import {
    allControlTypesSchema,
    anyOfSchema,
    arraysSchema,
    badgeSchema,
    categorySchema,
    checkboxSchema,
    childrenSchema,
    constSchema as constKeywordSchema,
    controlPluginCssSchema,
    controlPluginCssWithOverridesSchema,
    controlPluginSchema as customControlSchema,
    defaultsSchema,
    dictionarySchema,
    disabledSchema,
    generalSchema,
    invalidDataSchema,
    mergedOneOfSchema,
    nestedOneOfSchema,
    nullSchema as nullKeywordSchema,
    numberFieldSchema,
    objectsSchema,
    oneOfDeeplyNestedSchema as oneOfArraysSchema,
    oneOfSchema,
    textareaSchema,
    textSchema,
    tooltipSchema,
} from "../../../src/__tests__/schemas";
export const category = {
    schema: categorySchema,
};
export const customControl = {
    schema: customControlSchema,
};
export const controlPluginCssWithOverrides = {
    schema: controlPluginCssWithOverridesSchema,
};
export const controlPluginCss = {
    schema: controlPluginCssSchema,
};
export const textField = {
    schema: textareaSchema,
};
export const text = {
    schema: textSchema,
};
export const numberField = {
    schema: numberFieldSchema,
};
export const checkbox = {
    schema: checkboxSchema,
};
export const anyOf = {
    schema: anyOfSchema,
};
export const oneOf = {
    schema: oneOfSchema,
};
export const nestedOneOf = {
    schema: nestedOneOfSchema,
};
export const mergedOneOf = {
    schema: mergedOneOfSchema,
};
export const objects = {
    schema: objectsSchema,
};
export const arrays = {
    schema: arraysSchema,
};
export const oneOfArrays = {
    schema: oneOfArraysSchema,
};
export const children = {
    schema: childrenSchema,
};
export const generalExample = {
    schema: generalSchema,
};
export const badge = {
    schema: badgeSchema,
};
export const constKeyword = {
    schema: constKeywordSchema,
};
import InvalidDataDataSet from "../../../src/__tests__/datasets/invalid-data";
export const invalidData = {
    schema: invalidDataSchema,
    data: InvalidDataDataSet,
};
export const defaults = {
    schema: defaultsSchema,
};
export const nullKeyword = {
    schema: nullKeywordSchema,
};
export const allControlTypes = {
    schema: allControlTypesSchema,
};
import DictionaryDataSet from "../../../src/__tests__/datasets/dictionary";
export const dictionary = {
    schema: dictionarySchema,
    data: DictionaryDataSet,
};
export const tooltip = {
    schema: tooltipSchema,
};
export const disabled = {
    schema: disabledSchema,
};
