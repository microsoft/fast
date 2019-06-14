import React from "react";
import { ButtonBaseClassNameContract as JustifiedButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    JustifiedButtonStyles,
} from "@microsoft/fast-components-styles-msft";
import {
    ButtonBase,
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseProps,
    ButtonBaseUnhandledProps as JustifiedButtonUnhandledProps,
} from "../button-base";
import justifiedButtonSchema from "./justified-button.schema";
import { Subtract } from "utility-types";
import { DisplayNamePrefix } from "../utilities";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const JustifiedButton = manageJss(JustifiedButtonStyles)(ButtonBase);
type JustifiedButton = InstanceType<typeof JustifiedButton>;

interface JustifiedButtonHandledProps
    extends Subtract<ButtonBaseHandledProps, ButtonBaseManagedClasses> {}
type JustifiedButtonProps = ManagedJSSProps<
    ButtonBaseProps,
    JustifiedButtonClassNameContract,
    DesignSystem
>;

/**
 * Set the display name for the justified button
 */
JustifiedButton.displayName = `${DisplayNamePrefix}JustifiedButton`;

export {
    JustifiedButton,
    JustifiedButtonProps,
    JustifiedButtonClassNameContract,
    JustifiedButtonHandledProps,
    JustifiedButtonUnhandledProps,
    justifiedButtonSchema,
};
