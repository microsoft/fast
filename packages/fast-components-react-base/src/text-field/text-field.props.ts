import * as React from "react";
import { IManagedClasses, ITextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export enum TextFieldType {
   date = "date",
   email = "email",
   hidden = "hidden",
   month = "month",
   number = "number",
   password = "password",
   range = "range",
   search = "search",
   tel = "tel",
   text = "text",
   time = "time",
   url = "url",
   week = "week"
}

export interface ITextFieldHandledProps {
    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The error state
     */
    error?: boolean;

    /**
     * Placeholder Text for input field
     */
    placeholder?: string;

    /**
     * The text field input type
     */
    type?: TextFieldType;

    /**
     * The text field value
     */
    value?: string;
}

export interface ITextFieldUnhandledProps extends React.HTMLAttributes<HTMLInputElement> {}
export interface ITextFieldManagedClasses extends IManagedClasses<ITextFieldClassNameContract> {}
export type TextFieldProps = ITextFieldHandledProps & ITextFieldUnhandledProps & ITextFieldManagedClasses;
