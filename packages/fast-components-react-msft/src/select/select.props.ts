import React from "react";
import { Subtract } from "utility-types";
import {
    SelectHandledProps as BaseSelectHandledProps,
    SelectManagedClasses as BaseSelectManagedClasses,
    SelectUnhandledProps as BaseSelectUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    SelectClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface SelectManagedClasses extends ManagedClasses<SelectClassNameContract> {}
export interface SelectHandledProps
    extends SelectManagedClasses,
        Subtract<BaseSelectHandledProps, BaseSelectManagedClasses> {}

/* tslint:disable-next-line:no-empty-interface */
export interface SelectUnhandledProps extends BaseSelectUnhandledProps {}
export type SelectProps = SelectHandledProps & SelectUnhandledProps;
