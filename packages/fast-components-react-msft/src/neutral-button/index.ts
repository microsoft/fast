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
import neutralButtonSchema from "./neutral-button.schema";
import neutralButtonSchema2 from "./neutral-button.schema.2";
import { Subtract } from "utility-types";
import { DisplayNamePrefix } from "../utilities";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const NeutralButton = manageJss(NeutralButtonStyles)(ButtonBase);
type NeutralButton = InstanceType<typeof NeutralButton>;

interface NeutralButtonHandledProps
    extends Subtract<ButtonBaseHandledProps, ButtonBaseManagedClasses> {}
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
