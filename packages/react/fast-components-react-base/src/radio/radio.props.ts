import React from "react";
import {
    ManagedClasses,
    RadioClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Omit } from "utility-types";

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
     * The radio aria-label
     * This is necessary due to how unhandledProps are passed to the root of the component
     */
    ariaLabel?: string;

    /**
     * The value of the radio
     */
    value?: string;
}

export type RadioUnhandledProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "aria-label"
>;
/**
 * @deprecated
 */
export type RadioOnChange = (event?: React.ChangeEvent<HTMLInputElement>) => void;
export type RadioManagedClasses = ManagedClasses<RadioClassNameContract>;
export type RadioProps = RadioHandledProps & RadioUnhandledProps;
