import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    TextFieldHandledProps,
    TextFieldManagedClasses,
} from "@microsoft/fast-components-react-base";
import { Omit, Subtract } from "utility-types";
import { ButtonAppearance } from "../button/button.props";

export enum ButtonPosition {
    before = "before",
    after = "after",
}

export interface TextActionManagedClasses
    extends ManagedClasses<TextActionClassNameContract> {}
export interface TextActionUnhandledProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}
export interface TextActionHandledProps
    extends Subtract<TextFieldHandledProps, TextFieldManagedClasses>,
        TextActionManagedClasses {
    /**
     * The text action button
     */
    button?: (
        classname?: string,
        disabled?: boolean,
        appearance?: ButtonAppearance
    ) => React.ReactNode;

    /**
     * Button position
     * We can only have one button at a time, so rather than allowing a
     * before and after like glyph, we need to specify through an enum
     */
    buttonPosition?: ButtonPosition;

    /**
     * The preceding glyph
     */
    beforeGlyph?: (classname?: string) => React.ReactNode;

    /**
     * The trailing glyph
     */
    afterGlyph?: (classname?: string) => React.ReactNode;
}

export type TextActionProps = TextActionHandledProps & TextActionUnhandledProps;
