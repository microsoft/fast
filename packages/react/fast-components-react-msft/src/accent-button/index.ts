import React from "react";
import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { AccentButtonStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import {
    ButtonBaseUnhandledProps as AccentButtonUnhandledProps,
    ButtonBase,
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseProps,
} from "../button-base";
import { DisplayNamePrefix } from "../utilities";
import accentButtonSchema from "./accent-button.schema";
import accentButtonSchema2 from "./accent-button.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const AccentButton = manageJss(AccentButtonStyles)(ButtonBase);
type AccentButton = InstanceType<typeof AccentButton>;

type AccentButtonHandledProps = Omit<
    ButtonBaseHandledProps,
    keyof ButtonBaseManagedClasses
>;
type AccentButtonProps = ManagedJSSProps<
    ButtonBaseProps,
    AccentButtonClassNameContract,
    DesignSystem
>;

/**
 * Set the display name for the accent button
 */
AccentButton.displayName = `${DisplayNamePrefix}AccentButton`;

export {
    AccentButton,
    AccentButtonProps,
    AccentButtonClassNameContract,
    AccentButtonHandledProps,
    AccentButtonUnhandledProps,
    accentButtonSchema,
    accentButtonSchema2,
};
