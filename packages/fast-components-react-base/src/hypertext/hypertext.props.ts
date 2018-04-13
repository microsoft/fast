import * as React from "react";
import { IHypertextClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IHypertextHandledProps {

    /**
     * The HTML src attribute for the href attribute.
     */
    href?: string;

    /**
     * The option to set the content wrapped by hypertext.
     */
    children?: React.ReactNode | React.ReactNode[];
}

export interface IHypertextUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IHypertextManagedClasses extends IManagedClasses<IHypertextClassNameContract> {}
export type HypertextProps = IHypertextHandledProps & IHypertextUnhandledProps & IHypertextManagedClasses;
