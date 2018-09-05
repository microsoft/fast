import * as React from "react";
import { IManagedClasses, ICallToActionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export enum CallToActionAppearance {
    lightweight= "lightweight",
    primary= "primary",
    secondary= "secondary"
}

export interface ICallToActionHandledProps {

    /**
     * The call to action appearance
     */
    appearance?: CallToActionAppearance;

    /**
     * The content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The destination address
     */
    href: string;
}

export interface ICallToActionUnhandledProps extends React.AllHTMLAttributes<HTMLAnchorElement> {}
export interface ICallToActionManagedClasses extends IManagedClasses<ICallToActionClassNameContract> { }
export type CallToActionProps = ICallToActionHandledProps & ICallToActionUnhandledProps & ICallToActionManagedClasses;
