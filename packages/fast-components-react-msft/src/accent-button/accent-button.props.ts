import React from "react";
import { Subtract } from "utility-types";
import {
    ButtonBaseHandledProps,
    ButtonBaseManagedClasses,
    ButtonBaseUnhandledProps,
} from "../button-base";
import {
    AccentButtonClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface AccentButtonManagedClasses
    extends ManagedClasses<AccentButtonClassNameContract> {}

export interface AccentButtonHandledProps
    extends AccentButtonManagedClasses,
        Subtract<ButtonBaseHandledProps, ButtonBaseManagedClasses> {}

/* tslint:disable-next-line:no-empty-interface */
export interface AccentButtonUnhandledProps extends ButtonBaseUnhandledProps {}

export type AccentButtonProps = AccentButtonHandledProps & AccentButtonUnhandledProps;
