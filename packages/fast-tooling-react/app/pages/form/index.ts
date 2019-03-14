export interface ExampleComponent {
    schema: any;
    config?: any;
    weight?: any;
    attributeAssignment?: any;
}

import TextareaSchema from "./textarea/textarea.schema.json";

export const textField: ExampleComponent = {
    schema: TextareaSchema,
};

import NumberFieldSchema from "./number-field/number-field.schema.json";

export const numberField: ExampleComponent = {
    schema: NumberFieldSchema,
};

import CheckboxSchema from "./checkbox/checkbox.schema.json";

export const checkbox: ExampleComponent = {
    schema: CheckboxSchema,
};

import AnyOfSchema from "./any-of/any-of.schema.json";

export const anyOf: ExampleComponent = {
    schema: AnyOfSchema,
};

import OneOfSchema from "./one-of/one-of.schema.json";

export const oneOf: ExampleComponent = {
    schema: OneOfSchema,
};

import ObjectsSchema from "./objects/objects.schema.json";

export const objects: ExampleComponent = {
    schema: ObjectsSchema,
};

import ArraysSchema from "./arrays/arrays.schema.json";

export const arrays: ExampleComponent = {
    schema: ArraysSchema,
};

import ChildrenSchema from "./children/children.schema.json";

export const children: ExampleComponent = {
    schema: ChildrenSchema,
};

import GeneralSchema from "./general/general.schema.json";

export const generalExample: ExampleComponent = {
    schema: GeneralSchema,
};

import PluginSchema from "./plugin/plugin.schema.json";

export const plugin: ExampleComponent = {
    schema: PluginSchema,
};
