import * as React from "react";
import {
    ManagedClasses,
    TextAreaClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Subtract } from "utility-types";

export interface TextAreaManagedClasses
    extends ManagedClasses<TextAreaClassNameContract> {}
export interface TextAreaUnhandledProps
    extends Subtract<
            React.TextareaHTMLAttributes<HTMLTextAreaElement>,
            TextAreaHandledProps
        > {}
export interface TextAreaHandledProps extends TextAreaManagedClasses {
    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * Placeholder Text for text area
     */
    placeholder?: string;
}

export type TextAreaProps = TextAreaHandledProps & TextAreaUnhandledProps;
