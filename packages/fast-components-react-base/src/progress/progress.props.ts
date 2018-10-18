import * as React from "react";
import {
    ManagedClasses,
    ProgressClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ProgressManagedClasses
    extends ManagedClasses<ProgressClassNameContract> {}
export interface ProgressUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ProgressHandledProps extends ProgressManagedClasses {
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

export type ProgressProps = ProgressHandledProps & ProgressUnhandledProps;
