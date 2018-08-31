import * as React from "react";
import { IManagedClasses, IProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export interface IProgressHandledProps {
    /**
     * The progress content
     */
    children?: React.ReactNode | React.ReactNode[];

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

export interface IProgressUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IProgressManagedClasses extends IManagedClasses<IProgressClassNameContract> {}
export type ProgressProps = IProgressHandledProps & IProgressUnhandledProps & IProgressManagedClasses;
