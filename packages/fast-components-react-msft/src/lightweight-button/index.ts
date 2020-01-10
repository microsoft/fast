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
import lightweightButtonSchema from "./lightweight-button.schema";
import lightweightButtonSchema2 from "./lightweight-button.schema.2";
import { Subtract } from "utility-types";
import { DisplayNamePrefix } from "../utilities";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const LightweightButton = manageJss(LightweightButtonStyles)(ButtonBase);
type LightweightButton = InstanceType<typeof LightweightButton>;

interface LightweightButtonHandledProps
    extends Subtract<ButtonBaseHandledProps, ButtonBaseManagedClasses> {}
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
