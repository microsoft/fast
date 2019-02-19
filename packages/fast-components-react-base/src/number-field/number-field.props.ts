import * as React from "react";
import {
    ManagedClasses,
    NumberFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Omit } from "utility-types";

export interface NumberFieldManagedClasses
    extends ManagedClasses<NumberFieldClassNameContract> {}
export interface NumberFieldUnhandledProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}
// tslint:disable-next-line:no-empty-interface
export interface NumberFieldHandledProps extends NumberFieldManagedClasses {}

export type NumberFieldProps = NumberFieldHandledProps & NumberFieldUnhandledProps;
