export interface ExampleComponent {
    schema: any;
    data?: any;
}

import {
    allControlTypesSchema,
    anyOfSchema,
    arraysSchema,
    badgeSchema,
    categorySchema,
    checkboxSchema,
    childrenSchema,
    constSchema as constKeywordSchema,
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

export const category: ExampleComponent = {
    schema: categorySchema,
};

export const textField: ExampleComponent = {
    schema: textareaSchema,
};

export const text: ExampleComponent = {
    schema: textSchema,
};

export const numberField: ExampleComponent = {
    schema: numberFieldSchema,
};

export const checkbox: ExampleComponent = {
    schema: checkboxSchema,
};

export const anyOf: ExampleComponent = {
    schema: anyOfSchema,
};

export const oneOf: ExampleComponent = {
    schema: oneOfSchema,
};

export const nestedOneOf: ExampleComponent = {
    schema: nestedOneOfSchema,
};

export const mergedOneOf: ExampleComponent = {
    schema: mergedOneOfSchema,
};

export const objects: ExampleComponent = {
    schema: objectsSchema,
};

export const arrays: ExampleComponent = {
    schema: arraysSchema,
};

export const oneOfArrays: ExampleComponent = {
    schema: oneOfArraysSchema,
};

export const children: ExampleComponent = {
    schema: childrenSchema,
};

export const generalExample: ExampleComponent = {
    schema: generalSchema,
};

export const badge: ExampleComponent = {
    schema: badgeSchema,
};

export const constKeyword: ExampleComponent = {
    schema: constKeywordSchema,
};

import InvalidDataDataSet from "../../../src/__tests__/datasets/invalid-data";

export const invalidData: ExampleComponent = {
    schema: invalidDataSchema,
    data: InvalidDataDataSet,
};

export const defaults: ExampleComponent = {
    schema: defaultsSchema,
};

export const nullKeyword: ExampleComponent = {
    schema: nullKeywordSchema,
};

export const allControlTypes: ExampleComponent = {
    schema: allControlTypesSchema,
};

import DictionaryDataSet from "../../../src/__tests__/datasets/dictionary";

export const dictionary: ExampleComponent = {
    schema: dictionarySchema,
    data: DictionaryDataSet,
};

export const customControl: ExampleComponent = {
    schema: customControlSchema,
};

export const tooltip: ExampleComponent = {
    schema: tooltipSchema,
};

export const disabled: ExampleComponent = {
    schema: disabledSchema,
};
