import React from "react";
import { Subtract } from "utility-types";
import {
    ButtonHandledProps as BaseButtonHandledProps,
    ButtonManagedClasses as BaseButtonManagedClasses,
    ButtonUnhandledProps as BaseButtonUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ButtonClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum ButtonAppearance {
    justified = "justified",
    lightweight = "lightweight",
    outline = "outline",
    primary = "primary",
    stealth = "stealth",
}

export interface ButtonManagedClasses extends ManagedClasses<ButtonClassNameContract> {}
export interface ButtonHandledProps
    extends ButtonManagedClasses,
        Subtract<BaseButtonHandledProps, BaseButtonManagedClasses> {
    /**
     * The Button appearance
     */
    appearance?: ButtonAppearance;

    /**
     * The preceding content
     */
    beforeContent?: (classname?: string) => React.ReactNode;

    /**
     * The trailing content
     */
    afterContent?: (classname?: string) => React.ReactNode;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ButtonUnhandledProps extends BaseButtonUnhandledProps {}
export type ButtonProps = ButtonHandledProps & ButtonUnhandledProps;
