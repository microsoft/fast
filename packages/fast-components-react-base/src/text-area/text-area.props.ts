import React from "react";
import {
    ManagedClasses,
    TextAreaClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface TextAreaManagedClasses
    extends ManagedClasses<TextAreaClassNameContract> {}
export interface TextAreaUnhandledProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/* tslint:disable-next-line:no-empty-interface */
export interface TextAreaHandledProps extends TextAreaManagedClasses {}

export type TextAreaProps = TextAreaHandledProps & TextAreaUnhandledProps;
