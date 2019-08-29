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
import { Subtract } from "utility-types";

export enum ProgressSize {
    control = "control",
    container = "container",
    page = "page",
}

/* tslint:disable:no-empty-interface */
export interface ProgressManagedClasses
    extends ManagedClasses<ProgressClassNameContract> {}
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

export interface ProgressUnhandledProps extends BaseProgressUnhandledProps {}
/* tslint:enable:no-empty-interface */
export type ProgressProps = ProgressHandledProps & ProgressUnhandledProps;
