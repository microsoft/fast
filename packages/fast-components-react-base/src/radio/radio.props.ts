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
     * The onChange event
     */
    onChange?: RadioOnChange;

    /**
     * The radio content
     */
    children?: React.ReactNode;
}

export interface RadioUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type RadioOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
export interface RadioManagedClasses extends ManagedClasses<RadioClassNameContract> {}
export type RadioProps = RadioHandledProps & RadioUnhandledProps;
