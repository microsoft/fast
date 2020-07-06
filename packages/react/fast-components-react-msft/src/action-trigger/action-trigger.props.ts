import React from "react";
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
    outline = ButtonAppearance.outline,
    primary = ButtonAppearance.primary,
    stealth = ButtonAppearance.stealth,
}

export type ActionTriggerManagedClasses = ManagedClasses<ActionTriggerClassNameContract>;
export interface ActionTriggerHandledProps
    extends Omit<ButtonHandledProps, "appearance" | keyof ButtonManagedClasses>,
        ActionTriggerManagedClasses {
    /**
     * The action trigger appearance
     */
    appearance?: ActionTriggerAppearance;

    /**
     * The action trigger glyph render prop
     */
    glyph: (className: string) => React.ReactNode;

    /**
     * The action trigger link address
     */
    href?: string;

    /**
     * The action trigger disabled property
     */
    disabled?: boolean;
}

export type ActionTriggerUnhandledProps = ButtonUnhandledProps;
export type ActionTriggerProps = ActionTriggerHandledProps & ActionTriggerUnhandledProps;
