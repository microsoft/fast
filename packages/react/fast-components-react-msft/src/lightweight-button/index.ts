import React from "react";
import { ButtonBaseClassNameContract as LightweightButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    LightweightButtonStyles,
} from "@microsoft/fast-components-styles-msft";
import {
    ButtonBase,
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseProps,
    ButtonBaseUnhandledProps as LightweightButtonUnhandledProps,
} from "../button-base";
import { DisplayNamePrefix } from "../utilities";
import lightweightButtonSchema from "./lightweight-button.schema";
import lightweightButtonSchema2 from "./lightweight-button.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const LightweightButton = manageJss(LightweightButtonStyles)(ButtonBase);
type LightweightButton = InstanceType<typeof LightweightButton>;

type LightweightButtonHandledProps = Omit<
    ButtonBaseHandledProps,
    keyof ButtonBaseManagedClasses
>;
type LightweightButtonProps = ManagedJSSProps<
    ButtonBaseProps,
    LightweightButtonClassNameContract,
    DesignSystem
>;

/**
 * Set the display name for the lightweight button
 */
LightweightButton.displayName = `${DisplayNamePrefix}LightweightButton`;

export {
    LightweightButton,
    LightweightButtonProps,
    LightweightButtonClassNameContract,
    LightweightButtonHandledProps,
    LightweightButtonUnhandledProps,
    lightweightButtonSchema,
    lightweightButtonSchema2,
};
