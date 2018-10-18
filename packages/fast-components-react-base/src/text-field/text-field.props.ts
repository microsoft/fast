import * as React from "react";
import {
    ManagedClasses,
    TextFieldClassNameContract
} from "@microsoft/fast-components-class-name-contracts-base";
import { Omit } from "utility-types";

export enum TextFieldType {
    email = "email",
    number = "number",
    password = "password",
    search = "search",
    tel = "tel",
    text = "text",
    url = "url"
}

export interface TextFieldManagedClasses
    extends ManagedClasses<TextFieldClassNameContract> {}
export interface TextFieldUnhandledProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}
export interface TextFieldHandledProps extends TextFieldManagedClasses {
    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * Placeholder Text for input field
     */
    placeholder?: string;

    /**
     * The text field input type
     */
    type?: TextFieldType;
}

export type TextFieldProps = TextFieldHandledProps & TextFieldUnhandledProps;
