import React from "react";
import {
    ManagedClasses,
    RadioClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface RadioHandledProps extends RadioManagedClasses {
    /**
     * Unique Id
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
     * The onChange event
     */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;

    /**
     * The radio label
     */
    label?: (className: string) => React.ReactNode;

    /**
     * The value of the radio
     */
    value?: string;
}

export type RadioUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
/**
 * @deprecated
 */
export type RadioOnChange = (event?: React.ChangeEvent<HTMLInputElement>) => void;
export type RadioManagedClasses = ManagedClasses<RadioClassNameContract>;
export type RadioProps = RadioHandledProps & RadioUnhandledProps;
