import * as React from "react";
import { IHypertextClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IHypertextHandledProps {
    /**
     * The destination address
     */
    href?: string;

    /**
     * The hypertext content
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface IHypertextUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IHypertextManagedClasses extends IManagedClasses<IHypertextClassNameContract> {}
export type HypertextProps = IHypertextHandledProps & IHypertextUnhandledProps & IHypertextManagedClasses;
