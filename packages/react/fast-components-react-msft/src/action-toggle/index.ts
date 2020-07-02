import React from "react";
import { ActionToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ActionToggleStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTActionToggle, {
    ActionToggleAppearance,
    ActionToggleManagedClasses,
    ActionToggleUnhandledProps,
    ActionToggleHandledProps as MSFTActionToggleHandledProps,
    ActionToggleProps as MSFTActionToggleProps,
} from "./action-toggle";
import actionToggleSchema from "./action-toggle.schema";
import actionToggleSchema2 from "./action-toggle.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const ActionToggle = manageJss(ActionToggleStyles)(MSFTActionToggle);
type ActionToggle = InstanceType<typeof ActionToggle>;

type ActionToggleHandledProps = Omit<
    MSFTActionToggleHandledProps,
    keyof ActionToggleManagedClasses
>;
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
    actionToggleSchema,
    actionToggleSchema2,
    ActionToggleUnhandledProps,
};
