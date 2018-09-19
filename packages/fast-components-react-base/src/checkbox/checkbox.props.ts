import * as React from "react";
import { ICheckboxClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Button HTML tags
 */
export enum CheckboxTag {
    div = "div",
    label = "label"
}

export interface ICheckboxHandledProps {
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
    onChange?: CheckboxOnChange;

    /**
     * The checkbox content
     */
    children?: React.ReactNode;
}

export interface ICheckboxUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type CheckboxOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
export interface ICheckboxManagedClasses extends IManagedClasses<ICheckboxClassNameContract> {}
export type CheckboxProps = ICheckboxHandledProps & ICheckboxUnhandledProps & ICheckboxManagedClasses;
