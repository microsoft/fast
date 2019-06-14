import React from "react";
import { ButtonBaseClassNameContract as StealthButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    StealthButtonStyles,
} from "@microsoft/fast-components-styles-msft";
import {
    ButtonBase,
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseProps,
    ButtonBaseUnhandledProps as StealthButtonUnhandledProps,
} from "../button-base";
import stealthButtonSchema from "./stealth-button.schema";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const StealthButton = manageJss(StealthButtonStyles)(ButtonBase);
type StealthButton = InstanceType<typeof StealthButton>;

interface StealthButtonHandledProps
    extends Subtract<ButtonBaseHandledProps, ButtonBaseManagedClasses> {}
type StealthButtonProps = ManagedJSSProps<
    ButtonBaseProps,
    StealthButtonClassNameContract,
    DesignSystem
>;

export {
    StealthButton,
    StealthButtonProps,
    StealthButtonClassNameContract,
    StealthButtonHandledProps,
    StealthButtonUnhandledProps,
    stealthButtonSchema,
};
