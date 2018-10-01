import * as React from "react";
import {
    IProgressHandledProps as IBaseProgressHandledProps,
    IProgressManagedClasses as IBaseProgressManagedClasses,
    IProgressUnhandledProps as IBaseProgressUnhandledProps
} from "@microsoft/fast-components-react-base";
import { IManagedClasses, IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Subtract } from "utility-types";

/* tslint:disable:no-empty-interface */
export interface IProgressManagedClasses extends IManagedClasses<IMSFTProgressClassNameContract> {}
export interface IProgressHandledProps extends Subtract<IBaseProgressHandledProps, IBaseProgressManagedClasses>, IProgressManagedClasses {}
export interface IProgressUnhandledProps extends IBaseProgressHandledProps {}
/* tslint:enable:no-empty-interface */
export type ProgressProps = IProgressHandledProps & IProgressUnhandledProps;
