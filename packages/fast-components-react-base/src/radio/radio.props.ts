import * as React from "react";
import { IManagedClasses, IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export interface IRadioHandledProps {

    /**
     * Unique Id
     */
    id?: string;

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
    children?: React.ReactNode | React.ReactNode[];
}

export interface IRadioUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type RadioOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
export interface IRadioManagedClasses extends IManagedClasses<IRadioClassNameContract> {}
export type RadioProps = IRadioHandledProps & IRadioUnhandledProps & IRadioManagedClasses;
