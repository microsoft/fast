import React from "react";
import { ActionToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ActionToggleStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTActionToggle, {
    ActionToggleAppearance,
    ActionToggleHandledProps as MSFTActionToggleHandledProps,
    ActionToggleManagedClasses,
    ActionToggleProps as MSFTActionToggleProps,
    ActionToggleUnhandledProps,
} from "./action-toggle";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const ActionToggle = manageJss(ActionToggleStyles)(MSFTActionToggle);
type ActionToggle = InstanceType<typeof ActionToggle>;

interface ActionToggleHandledProps
    extends Subtract<MSFTActionToggleHandledProps, ActionToggleManagedClasses> {}
type ActionToggleProps = ManagedJSSProps<
    MSFTActionToggleProps,
    ActionToggleClassNameContract,
    DesignSystem
>;

export {
    ActionToggle,
    ActionToggleAppearance,
    ActionToggleProps,
    ActionToggleClassNameContract,
    ActionToggleHandledProps,
    ActionToggleUnhandledProps,
};
