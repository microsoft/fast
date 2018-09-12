import * as React from "react";
import { ICallToActionClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { ButtonAppearance, IButtonHandledProps } from "../button/button.props";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export enum CallToActionAppearance {
    justified= ButtonAppearance.justified,
    lightweight= ButtonAppearance.lightweight,
    primary= ButtonAppearance.primary
}

export interface ICallToActionHandledProps extends Omit<IButtonHandledProps, "appearance"> {

    /**
     * The call to action appearance
     */
    appearance?: CallToActionAppearance;
}

export interface ICallToActionUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ICallToActionManagedClasses extends IManagedClasses<ICallToActionClassNameContract> { }
export type CallToActionProps = ICallToActionHandledProps & ICallToActionUnhandledProps & ICallToActionManagedClasses;
