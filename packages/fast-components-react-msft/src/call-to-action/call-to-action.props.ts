import * as React from "react";
import { ICallToActionClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-msft";
import { ButtonAppearance, IButtonHandledProps } from "../button/button.props";

export type CallToActionAppearance = Exclude<ButtonAppearance, "outline">;

export interface ICallToActionHandledProps extends IButtonHandledProps {

    /**
     * The call to action appearance
     */
    appearance?: CallToActionAppearance;
}

export interface ICallToActionUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface ICallToActionManagedClasses extends IManagedClasses<ICallToActionClassNameContract> { }
export type CallToActionProps = ICallToActionHandledProps & ICallToActionUnhandledProps & ICallToActionManagedClasses;
