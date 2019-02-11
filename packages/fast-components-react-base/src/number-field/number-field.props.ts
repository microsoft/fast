import * as React from "react";
import {
    ManagedClasses,
    NumberFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface NumberFieldManagedClasses
    extends ManagedClasses<NumberFieldClassNameContract> {}
export interface NumberFieldUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface NumberFieldHandledProps extends NumberFieldManagedClasses {
    /**
     * Disabled state
     */
    disabled?: boolean;

    /**
     * HTML max value attribute
     */
    max?: number;

    /**
     * HTML min value attribute
     */
    min?: number;

    /**
     * HTML name attribute
     */
    name?: string;

    /**
     * HTML placeholder attribute
     */
    placeholder?: string;

    /**
     * HTML readOnly attribute
     */
    readOnly?: boolean;

    /**
     * HTML required attribute
     */
    required?: boolean;

    /**
     * HTML step attribute
     */
    step?: number;
}

export type NumberFieldProps = NumberFieldHandledProps & NumberFieldUnhandledProps;
