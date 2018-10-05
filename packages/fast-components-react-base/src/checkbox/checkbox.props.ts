import * as React from "react";
import { CheckboxClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Button HTML tags
 */
export enum CheckboxTag {
    div = "div",
    label = "label"
}

export enum CheckboxSlot {
    label = "label"
}

export interface CheckboxManagedClasses extends ManagedClasses<CheckboxClassNameContract> {}
export interface CheckboxUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface CheckboxHandledProps extends CheckboxManagedClasses {

    /**
     * The HTML tag (defaults to CheckboxTag.checkbox)
     */
    tag?: CheckboxTag;

    /**
     * The checked state
     */
    checked?: boolean;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The indeterminate option
     */
    indeterminate?: boolean;

    /**
     * The onChange event handler
     */
    onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;

    /**
     * The checkbox content
     */
    children?: React.ReactNode;
}

export type CheckboxProps = CheckboxHandledProps & CheckboxUnhandledProps;
