import * as React from "react";
import { IButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ButtonStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTButton, {
    ButtonAppearance,
    ButtonProps as MSFTButtonProps,
    ButtonSlot,
    IButtonHandledProps as IMSFTButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps
} from "./button";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Button = manageJss(ButtonStyles)(MSFTButton);
type Button = typeof Button;

interface IButtonHandledProps extends Subtract<IMSFTButtonHandledProps, IButtonManagedClasses> {}
type ButtonProps = ManagedJSSProps<MSFTButtonProps, IButtonClassNameContract, IDesignSystem>;

export {
    Button,
    ButtonAppearance,
    ButtonSlot,
    ButtonProps,
    IButtonClassNameContract,
    IButtonHandledProps,
    IButtonUnhandledProps
};
