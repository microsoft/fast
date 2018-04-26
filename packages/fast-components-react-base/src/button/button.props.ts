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
}

export interface IButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IButtonManagedClasses extends IManagedClasses<IButtonClassNameContract> {}
export type ButtonProps = IButtonHandledProps & IButtonUnhandledProps & IButtonManagedClasses;
