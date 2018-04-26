import * as React from "react";
import { IButtonHandledProps } from "@microsoft/fast-components-react-base";
import { IManagedClasses, IMSFTButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";

export interface IMSFTButtonHandledProps extends IButtonHandledProps {
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

export interface IMSFTButtonUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}
export interface IMSFTButtonManagedClasses extends IManagedClasses<IMSFTButtonClassNameContract> {}
export type MSFTButtonProps = IButtonHandledProps & IMSFTButtonUnhandledProps & IMSFTButtonManagedClasses;
