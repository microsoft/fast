import * as React from "react";
import {IHypertextClassNameContract, IManagedClasses} from "@microsoft/fast-components-class-name-contracts";

export interface IHypertextHandledProps {

    href?: string;

    children?: React.ReactNode | React.ReactNode[];
}

export interface IHypertextUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IHypertextManagedClasses extends IManagedClasses<IHypertextClassNameContract> {}
export type HypertextProps = IHypertextHandledProps & IHypertextUnhandledProps & IHypertextManagedClasses;
