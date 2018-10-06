import * as React from "react";
import { ManagedClasses, RadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export interface RadioHandledProps {

    /**
     * Unique Id
     */
    id: string;

    /**
     * The checked state
     */
    checked?: boolean;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The onChange state
     */
    onChange?: boolean;

    /**
     * The radio content
     */
    children?: React.ReactNode;
}

export interface RadioUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type RadioOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
export interface RadioManagedClasses extends ManagedClasses<RadioClassNameContract> {}
export type RadioProps = RadioHandledProps & RadioUnhandledProps & RadioManagedClasses;
