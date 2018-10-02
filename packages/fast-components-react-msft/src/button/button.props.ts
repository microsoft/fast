import * as React from "react";
import { Subtract } from "utility-types";
import {
    IButtonHandledProps as IBaseButtonHandledProps,
    IButtonManagedClasses as IBaseButtonManagedClasses,
    IButtonUnhandledProps as IBaseButtonUnhandledProps
} from "@microsoft/fast-components-react-base";
import { IManagedClasses, IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export enum ButtonAppearance {
    justified= "justified",
    lightweight= "lightweight",
    outline= "outline",
    primary= "primary",
}

export interface IButtonManagedClasses extends IManagedClasses<IButtonClassNameContract> {}
export interface IButtonHandledProps extends IButtonManagedClasses,
    Subtract<IBaseButtonHandledProps, IBaseButtonManagedClasses> {

    /**
     * The Button appearance
     */
    appearance?: ButtonAppearance;
}

/* tslint:disable-next-line:no-empty-interface */
export interface IButtonUnhandledProps extends IBaseButtonUnhandledProps {}
export type ButtonProps = IButtonHandledProps & IButtonUnhandledProps;
