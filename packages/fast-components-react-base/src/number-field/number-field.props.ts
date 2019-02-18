import * as React from "react";
import {
    ManagedClasses,
    NumberFieldClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface NumberFieldManagedClasses
    extends ManagedClasses<NumberFieldClassNameContract> {}
export interface NumberFieldUnhandledProps
    extends React.HTMLAttributes<HTMLInputElement> {}
export interface NumberFieldHandledProps extends NumberFieldManagedClasses {
    /**
     * HTML value attribute
     */
    value?: number;
}

export type NumberFieldProps = NumberFieldHandledProps & NumberFieldUnhandledProps;
