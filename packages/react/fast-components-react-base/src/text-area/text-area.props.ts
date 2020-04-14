import React from "react";
import {
    ManagedClasses,
    TextAreaClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export type TextAreaManagedClasses = ManagedClasses<TextAreaClassNameContract>;
export type TextAreaUnhandledProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type TextAreaHandledProps = TextAreaManagedClasses;

export type TextAreaProps = TextAreaHandledProps & TextAreaUnhandledProps;
