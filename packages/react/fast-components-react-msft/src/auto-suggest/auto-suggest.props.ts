import React from "react";
import {
    AutoSuggestHandledProps as BaseAutoSuggestHandledProps,
    AutoSuggestManagedClasses as BaseAutoSuggestManagedClasses,
    AutoSuggestUnhandledProps as BaseAutoSuggestUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    AutoSuggestClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export type AutoSuggestManagedClasses = ManagedClasses<AutoSuggestClassNameContract>;
export interface AutoSuggestHandledProps
    extends AutoSuggestManagedClasses,
        Omit<BaseAutoSuggestHandledProps, keyof BaseAutoSuggestManagedClasses> {}

export type AutoSuggestUnhandledProps = BaseAutoSuggestUnhandledProps;
export type AutoSuggestProps = AutoSuggestHandledProps & AutoSuggestUnhandledProps;
