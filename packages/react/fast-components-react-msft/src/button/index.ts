import React from "react";
import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ButtonStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTButton, {
    ButtonAppearance,
    ButtonManagedClasses,
    ButtonSlot,
    ButtonUnhandledProps,
    ButtonHandledProps as MSFTButtonHandledProps,
    ButtonProps as MSFTButtonProps,
} from "./button";
import buttonSchema from "./button.schema";
import buttonSchema2 from "./button.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Button = manageJss(ButtonStyles)(MSFTButton);
type Button = InstanceType<typeof Button>;

type ButtonHandledProps = Subtract<MSFTButtonHandledProps, ButtonManagedClasses>;
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
    buttonSchema,
    buttonSchema2,
    ButtonUnhandledProps,
};
