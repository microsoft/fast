import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    TextFieldHandledProps,
    TextFieldManagedClasses,
} from "@microsoft/fast-components-react-base";
import { Omit, Subtract } from "utility-types";

export enum TextActionAppearance {
    filled = "filled",
    outline = "outline",
}

export enum TextActionButtonPosition {
    before = "before",
    after = "after",
}

export type TextActionManagedClasses = ManagedClasses<TextActionClassNameContract>;
/* TODO: #1416 - https://github.com/Microsoft/fast/issues/1416 */
export type TextActionUnhandledProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
>;
export interface TextActionHandledProps
    extends Subtract<TextFieldHandledProps, TextFieldManagedClasses>,
        TextActionManagedClasses {
    /**
     * The text action appearance
     */
    appearance?: TextActionAppearance;

    /**
     * The text action button
     */
    button?: (classname?: string, disabled?: boolean) => React.ReactNode;

    /**
     * Text action button position
     * We can only have one button at a time, so rather than allowing a
     * before and after like glyph, we need to specify through an enum
     */
    buttonPosition?: TextActionButtonPosition;

    /**
     * The preceding glyph
     */
    beforeGlyph?: (classname?: string) => React.ReactNode;

    /**
     * The trailing glyph
     */
    afterGlyph?: (classname?: string) => React.ReactNode;

    /**
     * Callback for when text action input is focused
     */
    onFocus?: (e?: React.FocusEvent<HTMLInputElement>) => void;

    /**
     * Callback for when text action input is blurred
     */
    onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;

    /**
     * Overall disabled attribute that controls both the input and button disabled states
     */
    disabled?: boolean;

    /**
     * The class name applied to the root element
     */
    className?: string;
}

export type TextActionProps = TextActionHandledProps & TextActionUnhandledProps;
