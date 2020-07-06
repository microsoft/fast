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
import { DisplayNamePrefix } from "../utilities";
import stealthButtonSchema from "./stealth-button.schema";
import stealthButtonSchema2 from "./stealth-button.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const StealthButton = manageJss(StealthButtonStyles)(ButtonBase);
type StealthButton = InstanceType<typeof StealthButton>;

type StealthButtonHandledProps = Omit<
    ButtonBaseHandledProps,
    keyof ButtonBaseManagedClasses
>;
type StealthButtonProps = ManagedJSSProps<
    ButtonBaseProps,
    StealthButtonClassNameContract,
    DesignSystem
>;

/**
 * Set the display name for the stealth button
 */
StealthButton.displayName = `${DisplayNamePrefix}StealthButton`;

export {
    StealthButton,
    StealthButtonProps,
    StealthButtonClassNameContract,
    StealthButtonHandledProps,
    StealthButtonUnhandledProps,
    stealthButtonSchema,
    stealthButtonSchema2,
};
