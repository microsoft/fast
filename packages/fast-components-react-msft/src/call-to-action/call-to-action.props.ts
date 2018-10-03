import * as React from "react";
import { Omit, Subtract } from "utility-types";
import { ICallToActionClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { ButtonAppearance, IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "../button/button.props";

export enum CallToActionAppearance {
    justified = ButtonAppearance.justified,
    lightweight = ButtonAppearance.lightweight,
    primary = ButtonAppearance.primary
}

export interface ICallToActionManagedClasses extends IManagedClasses<ICallToActionClassNameContract> {}
export interface ICallToActionHandledProps extends Omit<
    IButtonHandledProps, "appearance" | keyof IButtonManagedClasses
>, ICallToActionManagedClasses {

    /**
     * The call to action appearance
     */
    appearance?: CallToActionAppearance;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ICallToActionUnhandledProps extends IButtonUnhandledProps {}
export type CallToActionProps = ICallToActionHandledProps & ICallToActionUnhandledProps;
