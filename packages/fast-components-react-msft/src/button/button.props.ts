import * as React from "react";
import { IButtonHandledProps as IBaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import { IManagedClasses, IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export enum Appearance {
    justified= "justified",
    lightweight= "lightweight",
    outline= "outline",
    primary= "primary",
}

export interface IButtonHandledProps extends IBaseButtonHandledProps {
    /**
     * The Button subType
     */
    appearance?: Appearance;
}

export interface IButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IButtonManagedClasses extends IManagedClasses<IMSFTButtonClassNameContract> {}
export type ButtonProps = IButtonHandledProps & IButtonUnhandledProps & IButtonManagedClasses;
