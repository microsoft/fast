import * as React from "react";
import { IManagedClasses, IRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export enum RadioTags {
    div = "div",
    label = "label"
}

export interface IRadioHandledProps {
    /**
     * The HTML tag
     */
    tag?: RadioTags;

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
     * The caption content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface IRadioUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export type RadioOnChange = (event?: React.ChangeEvent<HTMLElement>) => void;
export interface IRadioManagedClasses extends IManagedClasses<IRadioClassNameContract> {}
export type RadioProps = IRadioHandledProps & IRadioUnhandledProps & IRadioManagedClasses;
