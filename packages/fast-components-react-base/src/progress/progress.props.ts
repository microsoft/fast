import * as React from "react";
import { IManagedClasses, IProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export interface IProgressManagedClasses extends IManagedClasses<IProgressClassNameContract> {}
export interface IProgressUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IProgressHandledProps extends IProgressManagedClasses {
    /**
     * The progress content
     */
    children?: React.ReactNode;

    /**
     * The HTML max value attribute
     */
    maxValue?: number;

    /**
     * The HTML min value attribute
     */
    minValue?: number;

    /**
     * The HTML value attribute
     */
    value?: number;
}

export type ProgressProps = IProgressHandledProps & IProgressUnhandledProps;
