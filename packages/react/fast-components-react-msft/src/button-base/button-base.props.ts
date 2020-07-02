import React from "react";
import {
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ButtonBaseClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export type ButtonBaseManagedClasses = ManagedClasses<ButtonBaseClassNameContract>;
export interface ButtonBaseHandledProps
    extends ButtonBaseManagedClasses,
        Omit<ButtonHandledProps, keyof ButtonManagedClasses> {
    /**
     * The preceding content
     */
    beforeContent?: (className?: string) => React.ReactNode;

    /**
     * The trailing content
     */
    afterContent?: (className?: string) => React.ReactNode;
}

export type ButtonBaseUnhandledProps = ButtonUnhandledProps;
export type ButtonBaseProps = ButtonBaseHandledProps & ButtonBaseUnhandledProps;
