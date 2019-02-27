import * as React from "react";
import { Subtract } from "utility-types";
import {
    AutoSuggestHandledProps as BaseAutoSuggestHandledProps,
    AutoSuggestManagedClasses as BaseAutoSuggestManagedClasses,
    AutoSuggestUnhandledProps as BaseAutoSuggestUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    AutoSuggestClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface AutoSuggestManagedClasses
    extends ManagedClasses<AutoSuggestClassNameContract> {}
export interface AutoSuggestHandledProps
    extends AutoSuggestManagedClasses,
        Subtract<BaseAutoSuggestHandledProps, BaseAutoSuggestManagedClasses> {}

/* tslint:disable-next-line:no-empty-interface */
export interface AutoSuggestUnhandledProps extends BaseAutoSuggestUnhandledProps {}
export type AutoSuggestProps = AutoSuggestHandledProps & AutoSuggestUnhandledProps;
