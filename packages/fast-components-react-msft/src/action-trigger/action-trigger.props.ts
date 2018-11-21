import * as React from "react";
import { Omit } from "utility-types";
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
}

export interface ActionTriggerManagedClasses
    extends ManagedClasses<ActionTriggerClassNameContract> {}
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

/* tslint:disable-next-line:no-empty-interface */
export interface ActionTriggerUnhandledProps extends ButtonUnhandledProps {}
export type ActionTriggerProps = ActionTriggerHandledProps & ActionTriggerUnhandledProps;
