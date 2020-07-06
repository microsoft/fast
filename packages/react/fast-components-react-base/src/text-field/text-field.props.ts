import React from "react";
import {
    ManagedClasses,
    TextFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export enum TextFieldType {
    email = "email",
    number = "number",
    password = "password",
    search = "search",
    tel = "tel",
    text = "text",
    url = "url",
}

export type TextFieldManagedClasses = ManagedClasses<TextFieldClassNameContract>;
export type TextFieldUnhandledProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
>;
export interface TextFieldHandledProps extends TextFieldManagedClasses {
    /**
     * The text field input type
     */
    type?: TextFieldType;
}

export type TextFieldProps = TextFieldHandledProps & TextFieldUnhandledProps;
