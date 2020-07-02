import React from "react";
import {
    ButtonHandledProps as BaseButtonHandledProps,
    ButtonManagedClasses as BaseButtonManagedClasses,
    ButtonUnhandledProps as BaseButtonUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ButtonClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import { Subtract } from "utility-types";

export enum ButtonAppearance {
    justified = "justified",
    lightweight = "lightweight",
    outline = "outline",
    primary = "primary",
    stealth = "stealth",
}

export type ButtonManagedClasses = ManagedClasses<ButtonClassNameContract>;
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

export type ButtonUnhandledProps = BaseButtonUnhandledProps;
export type ButtonProps = ButtonHandledProps & ButtonUnhandledProps;
