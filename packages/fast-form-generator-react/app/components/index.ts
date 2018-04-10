import TextField from "./text-field/text-field";
import * as TextFieldSchema from "./text-field/text-field.schema.json";

export const textField = {
    component: TextField,
    schema: TextFieldSchema
}

import NumberField from "./number-field/number-field";
import * as NumberFieldSchema from "./number-field/number-field.schema.json";

export const numberField = {
    component: NumberField,
    schema: NumberFieldSchema
}

import Checkbox from "./checkbox/checkbox";
import * as CheckboxSchema from "./checkbox/checkbox.schema.json";

export const checkbox = {
    component: Checkbox,
    schema: CheckboxSchema
}

import AnyOf from "./any-of/any-of";
import * as AnyOfSchema from "./any-of/any-of.schema.json";

export const anyOf = {
    component: AnyOf,
    schema: AnyOfSchema
}

import OneOf from "./one-of/one-of";
import * as OneOfSchema from "./one-of/one-of.schema.json";

export const oneOf = {
    component: OneOf,
    schema: OneOfSchema
}

import Objects from "./objects/objects";
import * as ObjectsSchema from "./objects/objects.schema.json";

export const objects = {
    component: Objects,
    schema: ObjectsSchema
}

import Arrays from "./arrays/arrays";
import * as ArraysSchema from "./arrays/arrays.schema.json";

export const arrays = {
    component: Arrays,
    schema: ArraysSchema
}

import Children from "./children/children";
import * as ChildrenSchema from "./children/children.schema.json";

export const children = {
    component: Children,
    schema: ChildrenSchema
}

import AlignHorizontal from "./align-horizontal/align-horizontal";
import AlignHorizontalConfig from "./align-horizontal/align-horizontal.config";
import * as AlignHorizontalSchema from "./align-horizontal/align-horizontal.schema.json";

export const alignHorizontal = {
    component: AlignHorizontal,
    config: AlignHorizontalConfig,
    schema: AlignHorizontalSchema
}

import AlignVertical from "./align-vertical/align-vertical";
import AlignVerticalConfig from "./align-vertical/align-vertical.config";
import * as AlignVerticalSchema from "./align-vertical/align-vertical.schema.json";

export const alignVertical = {
    component: AlignVertical,
    config: AlignVerticalConfig,
    schema: AlignVerticalSchema
}

import WeightProperties from "./weight-properties/weight-properties";
import { weightPropertiesWeight, weightPropertiesConfig } from "./weight-properties/weight-properties.config";
import * as WeightPropertiesSchema from "./weight-properties/weight-properties.schema.json";

export const weightProperties = {
    component: WeightProperties,
    config: weightPropertiesConfig,
    weight: weightPropertiesWeight,
    schema: WeightPropertiesSchema
}

import AttributeAssignment from "./attribute-assignment/attribute-assignment";
import AttributeAssignmentConfig from "./attribute-assignment/attribute-assignment.config";
import * as AttributeAssignmentSchema from "./attribute-assignment/attribute-assignment.schema.json";

export const attributeAssignment = {
    component: AttributeAssignment,
    attributeAssignment: AttributeAssignmentConfig,
    schema: AttributeAssignmentSchema
}


import Theme from "./theme/theme";
import ThemeConfig from "./theme/theme.config";
import * as ThemeSchema from "./theme/theme.schema.json";

export const theme = {
    component: Theme,
    config: ThemeConfig,
    schema: ThemeSchema
}
