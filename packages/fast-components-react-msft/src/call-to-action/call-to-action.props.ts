import * as React from "react";
import { Omit, Subtract } from "utility-types";
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
    primary = ButtonAppearance.primary,
}

export interface CallToActionManagedClasses
    extends ManagedClasses<CallToActionClassNameContract> {}
export interface CallToActionHandledProps
    extends Omit<ButtonHandledProps, "appearance" | keyof ButtonManagedClasses>,
        CallToActionManagedClasses {
    /**
     * The call to action appearance
     */
    appearance?: CallToActionAppearance;
}

/* tslint:disable-next-line:no-empty-interface */
export interface CallToActionUnhandledProps extends ButtonUnhandledProps {}
export type CallToActionProps = CallToActionHandledProps & CallToActionUnhandledProps;
