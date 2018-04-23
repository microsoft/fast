import * as React from "react";
import { IButtonClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IButtonHandledProps {
    /**
     * The button content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The destination address (turns button to anchor)
     */
    href?: string;

    /**
     * The lightweight justified option
     */
    justified?: boolean;

    /**
     * The lightweight option
     */
    lightweight?: boolean;

    /**
     * The outline option
     */
    outline?: boolean;

    /**
     * The primary option
     */
    primary?: boolean;
}

export interface IButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IButtonManagedClasses extends IManagedClasses<IButtonClassNameContract> {}
export type ButtonProps = IButtonHandledProps & IButtonUnhandledProps & IButtonManagedClasses;
