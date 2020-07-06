import React from "react";
import {
    CallToActionClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";
import {
    ButtonAppearance,
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "../button/button.props";

export enum CallToActionAppearance {
    justified = ButtonAppearance.justified,
    lightweight = ButtonAppearance.lightweight,
    outline = ButtonAppearance.outline,
    primary = ButtonAppearance.primary,
    stealth = ButtonAppearance.stealth,
}

export type CallToActionManagedClasses = ManagedClasses<CallToActionClassNameContract>;
export interface CallToActionHandledProps
    extends Omit<ButtonHandledProps, "appearance" | keyof ButtonManagedClasses>,
        CallToActionManagedClasses {
    /**
     * The call to action appearance
     */
    appearance?: CallToActionAppearance;
}

export type CallToActionUnhandledProps = ButtonUnhandledProps;
export type CallToActionProps = CallToActionHandledProps & CallToActionUnhandledProps;
