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
    _16 = 16,
    _32 = 32,
    _64 = 64,
}

/* tslint:disable:no-empty-interface */
export interface ProgressManagedClasses
    extends ManagedClasses<ProgressClassNameContract> {}
export interface ProgressHandledProps
    extends Subtract<BaseProgressHandledProps, BaseProgressManagedClasses>,
        ProgressManagedClasses {
    circular?: boolean;
    size?: ProgressSize;
}

export interface ProgressUnhandledProps extends BaseProgressHandledProps {}
/* tslint:enable:no-empty-interface */
export type ProgressProps = ProgressHandledProps & ProgressUnhandledProps;
