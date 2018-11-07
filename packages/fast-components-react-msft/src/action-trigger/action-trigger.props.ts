import * as React from "react";
import { Omit, Subtract } from "utility-types";
import {
    ActionTriggerClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    ButtonAppearance,
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "../button/button.props";

export enum ActionTriggerAppearance {
    justified = ButtonAppearance.justified,
    lightweight = ButtonAppearance.lightweight,
    primary = ButtonAppearance.primary,
}

export interface ActionTriggerManagedClasses
    extends ManagedClasses<ActionTriggerClassNameContract> {}
export interface ActionTriggerHandledProps
    extends Omit<ButtonHandledProps, "appearance" | keyof ButtonManagedClasses>,
        ActionTriggerManagedClasses {
    /**
     * The call to action appearance
     */
    appearance?: ActionTriggerAppearance;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ActionTriggerUnhandledProps extends ButtonUnhandledProps {}
export type ActionTriggerProps = ActionTriggerHandledProps & ActionTriggerUnhandledProps;
