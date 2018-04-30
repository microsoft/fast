import * as React from "react";
import { IButtonHandledProps as IBaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import { IManagedClasses, IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export interface IButtonHandledProps extends IBaseButtonHandledProps {
    /**
     * The lightweight justified option
     */
    justified?: boolean;

    /**
     * The lightweight option
     */
    lightweight?: boolean;

    /**
     * The outline option
     */
    outline?: boolean;

    /**
     * The primary option
     */
    primary?: boolean;
}

export interface IButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IButtonManagedClasses extends IManagedClasses<IMSFTButtonClassNameContract> {}
export type ButtonProps = IButtonHandledProps & IButtonUnhandledProps & IButtonManagedClasses;
