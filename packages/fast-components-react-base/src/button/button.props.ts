import * as React from "react";
import { IButtonClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IButtonManagedClasses extends IManagedClasses<IButtonClassNameContract> {}
export interface IButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IButtonHandledProps extends IButtonManagedClasses {
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

export type ButtonProps = IButtonUnhandledProps & IButtonHandledProps;
