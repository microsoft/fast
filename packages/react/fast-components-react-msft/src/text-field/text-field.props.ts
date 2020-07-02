import {
    TextFieldHandledProps as BaseTextFieldHandledProps,
    TextFieldManagedClasses as BaseTextFieldManagedClasses,
    TextFieldUnhandledProps as BaseTextFieldUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    TextFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { Subtract } from "utility-types";

export enum TextFieldAppearance {
    filled = "filled",
    outline = "outline",
}

export type TextFieldManagedClasses = ManagedClasses<TextFieldClassNameContract>;
export interface TextFieldHandledProps
    extends TextFieldManagedClasses,
        Subtract<BaseTextFieldHandledProps, BaseTextFieldManagedClasses> {
    /**
     * The TextField appearance
     */
    appearance?: TextFieldAppearance;
}

export type TextFieldUnhandledProps = BaseTextFieldUnhandledProps;
export type TextFieldProps = TextFieldHandledProps & TextFieldUnhandledProps;
