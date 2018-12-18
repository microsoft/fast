import React from "react";
import MSFTAutoSuggestOption, {
    AutoSuggestOptionHandledProps as MSFTAutoSuggestOptionHandledProps,
    AutoSuggestOptionManagedClasses,
    AutoSuggestOptionProps as MSFTAutoSuggestOptionProps,
    AutoSuggestOptionUnhandledProps,
} from "./auto-suggest-option";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { AutoSuggestOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    AutoSuggestOptionStyles,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const AutoSuggestOption = manageJss(AutoSuggestOptionStyles)(MSFTAutoSuggestOption);
type AutoSuggestOption = InstanceType<typeof AutoSuggestOption>;

interface AutoSuggestOptionHandledProps
    extends Subtract<
            MSFTAutoSuggestOptionHandledProps,
            AutoSuggestOptionManagedClasses
        > {}
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
    AutoSuggestOptionUnhandledProps,
};
