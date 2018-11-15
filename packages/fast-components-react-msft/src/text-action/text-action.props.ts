import * as React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { TextActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    TextFieldHandledProps,
    TextFieldManagedClasses,
} from "@microsoft/fast-components-react-base";
import { Omit, Subtract } from "utility-types";

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
    button?: (className?: string) => React.ReactNode;
}

export type TextActionProps = TextActionHandledProps & TextActionUnhandledProps;
