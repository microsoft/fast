import * as React from "react";
import { IManagedClasses, ITextfieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

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

export interface ITextfieldHandledProps {
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
    placeholder: string;

    /**
     * The text field input type
     */
    type?: TextFieldType;

    /**
     * The text field value
     */
    value?: string;
}

export interface ITextfieldUnhandledProps extends React.HTMLAttributes<HTMLInputElement> {}
export interface ITextfieldManagedClasses extends IManagedClasses<ITextfieldClassNameContract> {}
export type TextfieldProps = ITextfieldHandledProps & ITextfieldUnhandledProps & ITextfieldManagedClasses;
