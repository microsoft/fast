import * as React from "react";
import { ICheckboxClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Button HTML tags
 */
export enum CheckboxTag {
    div = "div",
    label = "label"
}

export interface ICheckboxManagedClasses extends IManagedClasses<ICheckboxClassNameContract> {}
export interface ICheckboxUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ICheckboxHandledProps extends ICheckboxManagedClasses {
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

export type CheckboxProps = ICheckboxHandledProps & ICheckboxUnhandledProps;
