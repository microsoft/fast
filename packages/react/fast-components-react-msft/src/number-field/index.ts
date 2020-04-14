import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    NumberField as BaseNumberField,
    NumberFieldHandledProps as BaseNumberFieldHandledProps,
    NumberFieldProps as BaseNumberFieldProps,
    NumberFieldClassNameContract,
    NumberFieldManagedClasses,
    NumberFieldUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, NumberFieldStyles } from "@microsoft/fast-components-styles-msft";
import numberFieldSchema from "./number-field.schema";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const NumberField = manageJss(NumberFieldStyles)(BaseNumberField);
type NumberField = InstanceType<typeof NumberField>;

type NumberFieldHandledProps = BaseNumberFieldHandledProps;
type NumberFieldProps = ManagedJSSProps<
    BaseNumberFieldProps,
    NumberFieldClassNameContract,
    DesignSystem
>;

export {
    NumberFieldClassNameContract,
    NumberFieldHandledProps,
    NumberFieldManagedClasses,
    NumberFieldUnhandledProps,
    NumberField,
    NumberFieldProps,
    numberFieldSchema,
};
