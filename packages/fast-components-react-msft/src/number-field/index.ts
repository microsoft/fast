import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    NumberField as BaseNumberField,
    NumberFieldClassNameContract,
    NumberFieldHandledProps as BaseNumberFieldHandledProps,
    NumberFieldManagedClasses,
    NumberFieldProps as BaseNumberFieldProps,
    NumberFieldUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, NumberFieldStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const NumberField = manageJss(NumberFieldStyles)(BaseNumberField);
type NumberField = InstanceType<typeof NumberField>;

// tslint:disable-next-line:no-empty-interface
interface NumberFieldHandledProps extends BaseNumberFieldHandledProps {}
type NumberFieldProps = ManagedJSSProps<
    BaseNumberFieldProps,
    NumberFieldClassNameContract,
    DesignSystem
>;

export {
    NumberFieldClassNameContract,
    NumberFieldHandledProps,
    NumberFieldUnhandledProps,
    NumberField,
    NumberFieldProps,
};
