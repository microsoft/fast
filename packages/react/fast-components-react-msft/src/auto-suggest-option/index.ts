import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { AutoSuggestOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    AutoSuggestOptionStyles,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import autoSuggestOptionSchema from "./auto-suggest-option.schema";
import autoSuggestOptionSchema2 from "./auto-suggest-option.schema.2";
import MSFTAutoSuggestOption, {
    AutoSuggestOptionManagedClasses,
    AutoSuggestOptionUnhandledProps,
    AutoSuggestOptionHandledProps as MSFTAutoSuggestOptionHandledProps,
    AutoSuggestOptionProps as MSFTAutoSuggestOptionProps,
} from "./auto-suggest-option";

const AutoSuggestOption = manageJss(AutoSuggestOptionStyles)(MSFTAutoSuggestOption);
type AutoSuggestOption = InstanceType<typeof AutoSuggestOption>;

type AutoSuggestOptionHandledProps = Subtract<
    MSFTAutoSuggestOptionHandledProps,
    AutoSuggestOptionManagedClasses
>;
type AutoSuggestOptionProps = ManagedJSSProps<
    MSFTAutoSuggestOptionProps,
    AutoSuggestOptionClassNameContract,
    DesignSystem
>;

export {
    AutoSuggestOption,
    AutoSuggestOptionProps,
    AutoSuggestOptionClassNameContract,
    AutoSuggestOptionHandledProps,
    autoSuggestOptionSchema,
    autoSuggestOptionSchema2,
    AutoSuggestOptionUnhandledProps,
};
