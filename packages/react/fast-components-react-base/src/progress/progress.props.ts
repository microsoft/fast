import React from "react";
import {
    ManagedClasses,
    ProgressClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export type ProgressManagedClasses = ManagedClasses<ProgressClassNameContract>;
export type ProgressUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
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
