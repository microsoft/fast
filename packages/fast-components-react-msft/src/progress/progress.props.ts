import * as React from "react";
import { IProgressHandledProps, IProgressUnhandledProps } from "@microsoft/fast-components-react-base";
import { IManagedClasses, IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

/* tslint:disable no-empty-interface */
export interface IMSFTProgressHandledProps extends IProgressHandledProps {}
export interface IMSFTProgressUnhandledProps extends IProgressHandledProps {}
export interface IMSFTProgressManagedClasses extends IManagedClasses<IMSFTProgressClassNameContract> {}
/* tslint:enable no-empty-interface */
export type MSFTProgressProps = IProgressHandledProps & IProgressUnhandledProps & IMSFTProgressManagedClasses;
