export interface IExampleComponent {
    component: any;
    schema: any;
    config?: any;
    weight?: any;
    attributeAssignment?: any;
}

import TextField from "./text-field/text-field";
import TextFieldSchema from "./text-field/text-field.schema.json";

export const textField: IExampleComponent = {
    component: TextField,
    schema: TextFieldSchema
};

import NumberField from "./number-field/number-field";
import NumberFieldSchema from "./number-field/number-field.schema.json";

export const numberField: IExampleComponent = {
    component: NumberField,
    schema: NumberFieldSchema
};

import Checkbox from "./checkbox/checkbox";
import CheckboxSchema from "./checkbox/checkbox.schema.json";

export const checkbox: IExampleComponent = {
    component: Checkbox,
    schema: CheckboxSchema
};

import AnyOf from "./any-of/any-of";
import AnyOfSchema from "./any-of/any-of.schema.json";

export const anyOf: IExampleComponent = {
    component: AnyOf,
    schema: AnyOfSchema
};

import OneOf from "./one-of/one-of";
import OneOfSchema from "./one-of/one-of.schema.json";

export const oneOf: IExampleComponent = {
    component: OneOf,
    schema: OneOfSchema
};

import Objects from "./objects/objects";
import ObjectsSchema from "./objects/objects.schema.json";

export const objects: IExampleComponent = {
    component: Objects,
    schema: ObjectsSchema
};

import Arrays from "./arrays/arrays";
import ArraysSchema from "./arrays/arrays.schema.json";

export const arrays: IExampleComponent = {
    component: Arrays,
    schema: ArraysSchema
};

import Children from "./children/children";
import ChildrenSchema from "./children/children.schema.json";

export const children: IExampleComponent = {
    component: Children,
    schema: ChildrenSchema
};

import AlignHorizontal from "./align-horizontal/align-horizontal";
import AlignHorizontalConfig from "./align-horizontal/align-horizontal.config";
import AlignHorizontalSchema from "./align-horizontal/align-horizontal.schema.json";

export const alignHorizontal: IExampleComponent = {
    component: AlignHorizontal,
    config: AlignHorizontalConfig,
    schema: AlignHorizontalSchema
};

import AlignVertical from "./align-vertical/align-vertical";
import AlignVerticalConfig from "./align-vertical/align-vertical.config";
import AlignVerticalSchema from "./align-vertical/align-vertical.schema.json";

export const alignVertical: IExampleComponent = {
    component: AlignVertical,
    config: AlignVerticalConfig,
    schema: AlignVerticalSchema
};

import WeightProperties from "./weight-properties/weight-properties";
import { weightPropertiesConfig, weightPropertiesWeight } from "./weight-properties/weight-properties.config";
import WeightPropertiesSchema from "./weight-properties/weight-properties.schema.json";

export const weightProperties: IExampleComponent = {
    component: WeightProperties,
    config: weightPropertiesConfig,
    weight: weightPropertiesWeight,
    schema: WeightPropertiesSchema
};

import GeneralExample from "./general-example/general-example";
import GeneralExampleConfig from "./general-example/general-example.config";
import GeneralExampleSchema from "./general-example/general-example.schema.json";

export const generalExample: IExampleComponent = {
    component: GeneralExample,
    config: GeneralExampleConfig,
    schema: GeneralExampleSchema
};

import AttributeAssignment from "./attribute-assignment/attribute-assignment";
import AttributeAssignmentConfig from "./attribute-assignment/attribute-assignment.config";
import AttributeAssignmentSchema from "./attribute-assignment/attribute-assignment.schema.json";

export const attributeAssignment: IExampleComponent = {
    component: AttributeAssignment,
    attributeAssignment: AttributeAssignmentConfig,
    schema: AttributeAssignmentSchema
};

import Theme from "./theme/theme";
import ThemeConfig from "./theme/theme.config";
import ThemeSchema from "./theme/theme.schema.json";

export const theme: IExampleComponent = {
    component: Theme,
    config: ThemeConfig,
    schema: ThemeSchema
};
