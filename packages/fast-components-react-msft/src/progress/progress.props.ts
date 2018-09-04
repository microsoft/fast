import * as React from "react";
import { IProgressHandledProps } from "@microsoft/fast-components-react-base";
import { IManagedClasses, IMSFTProgressClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export { IProgressHandledProps };
export interface IProgressUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IProgressManagedClasses extends IManagedClasses<IMSFTProgressClassNameContract> {}
export type ProgressProps = IProgressHandledProps & IProgressUnhandledProps & IProgressManagedClasses;
