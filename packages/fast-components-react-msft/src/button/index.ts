import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    IButtonClassNameContract,
} from "@microsoft/fast-components-react-base";
import { IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { ButtonStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTButton, {
    ButtonAppearance,
    ButtonProps as MSFTButtonProps,
    ButtonSlot,
    IButtonUnhandledProps
} from "./button";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Button = manageJss(ButtonStyles)(MSFTButton);
type Button = InstanceType<typeof Button>;

interface IButtonHandledProps extends JSSManagerProps<MSFTButtonProps, IButtonClassNameContract, IDesignSystem> {}
type ButtonProps = IButtonHandledProps & IButtonUnhandledProps;

export {
    Button,
    ButtonAppearance,
    ButtonSlot,
    ButtonProps,
    IButtonClassNameContract,
    IButtonHandledProps,
    IButtonUnhandledProps
};
