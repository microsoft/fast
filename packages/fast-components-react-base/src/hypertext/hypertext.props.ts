import * as React from "react";
import { IHypertextClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IHypertextManagedClasses extends IManagedClasses<IHypertextClassNameContract> {}
export interface IHypertextUnhandledProps extends React.HTMLAttributes<HTMLAnchorElement> {}
export interface IHypertextHandledProps extends IHypertextManagedClasses {
    /**
     * The destination address
     */
    href?: string;

    /**
     * The hypertext content
     */
    children?: React.ReactNode;
}

export type HypertextProps = IHypertextHandledProps & IHypertextUnhandledProps;
