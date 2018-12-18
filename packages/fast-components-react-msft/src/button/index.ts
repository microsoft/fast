import React from "react";
import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ButtonStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTButton, {
    ButtonAppearance,
    ButtonHandledProps as MSFTButtonHandledProps,
    ButtonManagedClasses,
    ButtonProps as MSFTButtonProps,
    ButtonSlot,
    ButtonUnhandledProps,
} from "./button";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Button = manageJss(ButtonStyles)(MSFTButton);
type Button = InstanceType<typeof Button>;

interface ButtonHandledProps
    extends Subtract<MSFTButtonHandledProps, ButtonManagedClasses> {}
type ButtonProps = ManagedJSSProps<
    MSFTButtonProps,
    ButtonClassNameContract,
    DesignSystem
>;

export {
    Button,
    ButtonAppearance,
    ButtonSlot,
    ButtonProps,
    ButtonClassNameContract,
    ButtonHandledProps,
    ButtonUnhandledProps,
};
