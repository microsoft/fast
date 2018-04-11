import * as React from "react";
import { IToggleClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

export interface IToggleHandledProps {
    children?: React.ReactNode | React.ReactNode[];
    disabled?: boolean;
    id: string;
    labelId?: string;
    selected?: boolean;
    selectedString: string;
    statusLabelId: string;
    unselectedString: string;
}

export interface IToggleUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IToggleManagedClasses extends IManagedClasses<IToggleClassNameContract> {}
export type ToggleProps = IToggleHandledProps & IToggleUnhandledProps & IToggleManagedClasses;