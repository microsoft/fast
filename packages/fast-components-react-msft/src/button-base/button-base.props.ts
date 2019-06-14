import React from "react";
import { Subtract } from "utility-types";
import {
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ButtonBaseClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface ButtonBaseManagedClasses
    extends ManagedClasses<ButtonBaseClassNameContract> {}
export interface ButtonBaseHandledProps
    extends ButtonBaseManagedClasses,
        Subtract<ButtonHandledProps, ButtonManagedClasses> {
    /**
     * The preceding content
     */
    beforeContent?: (className?: string) => React.ReactNode;

    /**
     * The trailing content
     */
    afterContent?: (className?: string) => React.ReactNode;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ButtonBaseUnhandledProps extends ButtonUnhandledProps {}
export type ButtonBaseProps = ButtonBaseHandledProps & ButtonBaseUnhandledProps;
