import React from "react";
import { ButtonBaseClassNameContract as NeutralButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    DesignSystem,
    NeutralButtonStyles,
} from "@microsoft/fast-components-styles-msft";
import {
    ButtonBase,
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseProps,
    ButtonBaseUnhandledProps as NeutralButtonUnhandledProps,
} from "../button-base";
import { DisplayNamePrefix } from "../utilities";
import neutralButtonSchema from "./neutral-button.schema";
import neutralButtonSchema2 from "./neutral-button.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const NeutralButton = manageJss(NeutralButtonStyles)(ButtonBase);
type NeutralButton = InstanceType<typeof NeutralButton>;

type NeutralButtonHandledProps = Subtract<
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses
>;
type NeutralButtonProps = ManagedJSSProps<
    ButtonBaseProps,
    NeutralButtonClassNameContract,
    DesignSystem
>;

/**
 * Set the display name for the neutral button
 */
NeutralButton.displayName = `${DisplayNamePrefix}NeutralButton`;

export {
    NeutralButton,
    NeutralButtonProps,
    NeutralButtonClassNameContract,
    NeutralButtonHandledProps,
    NeutralButtonUnhandledProps,
    neutralButtonSchema,
    neutralButtonSchema2,
};
