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

import AlignHorizontalConfig from "./align-horizontal/align-horizontal.config";
import AlignHorizontalSchema from "./align-horizontal/align-horizontal.schema.json";

export const alignHorizontal: ExampleComponent = {
    config: AlignHorizontalConfig,
    schema: AlignHorizontalSchema,
};

import AlignVerticalConfig from "./align-vertical/align-vertical.config";
import AlignVerticalSchema from "./align-vertical/align-vertical.schema.json";

export const alignVertical: ExampleComponent = {
    config: AlignVerticalConfig,
    schema: AlignVerticalSchema,
};

import {
    weightPropertiesConfig,
    weightPropertiesWeight,
} from "./weight-properties/weight-properties.config";
import WeightPropertiesSchema from "./weight-properties/weight-properties.schema.json";

export const weightProperties: ExampleComponent = {
    config: weightPropertiesConfig,
    weight: weightPropertiesWeight,
    schema: WeightPropertiesSchema,
};

import GeneralConfig from "./general/general.config";
import GeneralSchema from "./general/general.schema.json";

export const generalExample: ExampleComponent = {
    config: GeneralConfig,
    schema: GeneralSchema,
};

import AttributeAssignmentConfig from "./attribute-assignment/attribute-assignment.config";
import AttributeAssignmentSchema from "./attribute-assignment/attribute-assignment.schema.json";

export const attributeAssignment: ExampleComponent = {
    attributeAssignment: AttributeAssignmentConfig,
    schema: AttributeAssignmentSchema,
};

import ThemeConfig from "./theme/theme.config";
import ThemeSchema from "./theme/theme.schema.json";

export const theme: ExampleComponent = {
    config: ThemeConfig,
    schema: ThemeSchema,
};

import PluginSchema from "./plugin/plugin.schema.json";

export const plugin: ExampleComponent = {
    schema: PluginSchema,
};
