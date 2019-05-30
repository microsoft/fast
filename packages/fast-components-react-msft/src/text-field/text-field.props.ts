import React from "react";
import { Subtract } from "utility-types";
import {
    TextFieldHandledProps as BaseTextFieldHandledProps,
    TextFieldManagedClasses as BaseTextFieldManagedClasses,
    TextFieldUnhandledProps as BaseTextFieldUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    TextFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum TextFieldAppearance {
    filled = "filled",
    outline = "outline",
}

export interface TextFieldManagedClasses
    extends ManagedClasses<TextFieldClassNameContract> {}
export interface TextFieldHandledProps
    extends TextFieldManagedClasses,
        Subtract<BaseTextFieldHandledProps, BaseTextFieldManagedClasses> {
    /**
     * The TextField appearance
     */
    appearance?: TextFieldAppearance;
}

/* tslint:disable-next-line:no-empty-interface */
export interface TextFieldUnhandledProps extends BaseTextFieldUnhandledProps {}
export type TextFieldProps = TextFieldHandledProps & TextFieldUnhandledProps;
