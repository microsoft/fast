import React from "react";
import {
    CheckboxClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

/**
 * @deprecated
 * Slots have been deprecated and will be removed in the next major version
 * Use the `label` prop instead
 */
export enum CheckboxSlot {
    label = "label",
}

export type CheckboxManagedClasses = ManagedClasses<CheckboxClassNameContract>;
export type CheckboxUnhandledProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "aria-label"
>;
export interface CheckboxHandledProps extends CheckboxManagedClasses {
    /**
     * The id of the checkbox input element
     */
    inputId: string;

    /**
     * The checked state
     */
    checked?: boolean;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The name of the input
     */
    name?: string;

    /**
     * The indeterminate option
     */
    indeterminate?: boolean;

    /**
     * The onChange event handler
     */
    onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;

    /**
     * The checkbox label
     */
    label?: (className: string) => React.ReactNode;

    /**
     * The checkbox aria-label
     * This is necessary due to how unhandledProps are passed to the root of the component
     */
    ariaLabel?: string;

    /**
     * The value of the checkbox
     */
    value?: string;
}

export type CheckboxProps = CheckboxHandledProps & CheckboxUnhandledProps;
