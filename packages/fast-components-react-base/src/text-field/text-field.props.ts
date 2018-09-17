import * as React from "react";
import { IManagedClasses, ITextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export enum TextFieldType {
    /**
     * @deprecated as of v2.3.0
     * Will be deleted in version 3.0.
     */
    date = "date",
    email = "email",
    /**
     * @deprecated as of v2.3.0
     * Will be deleted in version 3.0.
     */
    hidden = "hidden",
    /**
     * @deprecated as of v2.3.0
     * Will be deleted in version 3.0.
     */
    month = "month",
    number = "number",
    password = "password",
    /**
     * @deprecated as of v2.3.0
     * Will be deleted in version 3.0.
     */
    range = "range",
    search = "search",
    tel = "tel",
    text = "text",
    /**
     * @deprecated as of v2.3.0
     * Will be deleted in version 3.0.
     */
    time = "time",
    url = "url",
    /**
     * @deprecated as of v2.3.0
     * Will be deleted in version 3.0.
     */
    week = "week"
}

export interface ITextFieldHandledProps {
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

export interface ITextFieldUnhandledProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export interface ITextFieldManagedClasses extends IManagedClasses<ITextFieldClassNameContract> {}
export type TextFieldProps = ITextFieldHandledProps & ITextFieldUnhandledProps & ITextFieldManagedClasses;
