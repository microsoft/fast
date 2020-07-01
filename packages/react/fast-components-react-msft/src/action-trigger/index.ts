import React from "react";
import { ActionTriggerClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    ActionTriggerStyles,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import MSFTActionTrigger, {
    ActionTriggerAppearance,
    ActionTriggerManagedClasses,
    ActionTriggerUnhandledProps,
    ActionTriggerHandledProps as MSFTActionTriggerHandledProps,
    ActionTriggerProps as MSFTActionTriggerProps,
} from "./action-trigger";
import actionTriggerSchema from "./action-trigger.schema";
import actionTriggerSchema2 from "./action-trigger.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const ActionTrigger = manageJss(ActionTriggerStyles)(MSFTActionTrigger);
type ActionTrigger = InstanceType<typeof ActionTrigger>;

type ActionTriggerHandledProps = Subtract<
    MSFTActionTriggerHandledProps,
    ActionTriggerManagedClasses
>;
type ActionTriggerProps = ManagedJSSProps<
    MSFTActionTriggerProps,
    ActionTriggerClassNameContract,
    DesignSystem
>;

export {
    ActionTrigger,
    ActionTriggerAppearance,
    ActionTriggerProps,
    ActionTriggerClassNameContract,
    ActionTriggerHandledProps,
    actionTriggerSchema,
    actionTriggerSchema2,
    ActionTriggerUnhandledProps,
};
