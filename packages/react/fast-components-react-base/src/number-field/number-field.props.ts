import React from "react";
import {
    ManagedClasses,
    NumberFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export type NumberFieldManagedClasses = ManagedClasses<NumberFieldClassNameContract>;
export type NumberFieldUnhandledProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
>;

export type NumberFieldHandledProps = NumberFieldManagedClasses;

export type NumberFieldProps = NumberFieldHandledProps & NumberFieldUnhandledProps;
