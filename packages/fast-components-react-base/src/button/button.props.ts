import * as React from "react";
import {
    ButtonClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ButtonManagedClasses extends ManagedClasses<ButtonClassNameContract> {}
export interface ButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ButtonHandledProps extends ButtonManagedClasses {
    /**
     * The button content
     */
    children?: React.ReactNode;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The destination address (turns button to anchor)
     */
    href?: string;
}

export type ButtonProps = ButtonUnhandledProps & ButtonHandledProps;
