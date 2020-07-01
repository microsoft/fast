import React from "react";
import { ButtonBaseClassNameContract as OutlineButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    OutlineButtonStyles,
} from "@microsoft/fast-components-styles-msft";
import {
    ButtonBase,
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseProps,
    ButtonBaseUnhandledProps as OutlineButtonUnhandledProps,
} from "../button-base";
import { DisplayNamePrefix } from "../utilities";
import outlineButtonSchema from "./outline-button.schema";
import outlineButtonSchema2 from "./outline-button.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const OutlineButton = manageJss(OutlineButtonStyles)(ButtonBase);
type OutlineButton = InstanceType<typeof OutlineButton>;

type OutlineButtonHandledProps = Subtract<
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses
>;
type OutlineButtonProps = ManagedJSSProps<
    ButtonBaseProps,
    OutlineButtonClassNameContract,
    DesignSystem
>;

/**
 * Set the display name for the outline button
 */
OutlineButton.displayName = `${DisplayNamePrefix}OutlineButton`;

export {
    OutlineButton,
    OutlineButtonProps,
    OutlineButtonClassNameContract,
    OutlineButtonHandledProps,
    OutlineButtonUnhandledProps,
    outlineButtonSchema,
    outlineButtonSchema2,
};
