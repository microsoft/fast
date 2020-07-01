import React from "react";
import {
    ProgressHandledProps as BaseProgressHandledProps,
    ProgressManagedClasses as BaseProgressManagedClasses,
    ProgressUnhandledProps as BaseProgressUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    ProgressClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum ProgressSize {
    control = "control",
    container = "container",
    page = "page",
}

export type ProgressManagedClasses = ManagedClasses<ProgressClassNameContract>;
export interface ProgressHandledProps
    extends Subtract<BaseProgressHandledProps, BaseProgressManagedClasses>,
        ProgressManagedClasses {
    /**
     * The progress circular prop
     */
    circular?: boolean;

    /**
     * The progress paused prop
     */
    paused?: boolean;

    /**
     * The progress size prop
     */
    size?: ProgressSize;
}

export type ProgressUnhandledProps = BaseProgressUnhandledProps;
export type ProgressProps = ProgressHandledProps & ProgressUnhandledProps;
