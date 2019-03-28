import React from "react";
import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { AutoSuggestStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTAutoSuggest, {
    AutoSuggestHandledProps as MSFTAutoSuggestHandledProps,
    AutoSuggestManagedClasses,
    AutoSuggestProps as MSFTAutoSuggestProps,
    AutoSuggestUnhandledProps,
} from "./auto-suggest";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const AutoSuggest = manageJss(AutoSuggestStyles)(MSFTAutoSuggest);
type AutoSuggest = InstanceType<typeof AutoSuggest>;

interface AutoSuggestHandledProps
    extends Subtract<MSFTAutoSuggestHandledProps, AutoSuggestManagedClasses> {}
type AutoSuggestProps = ManagedJSSProps<
    MSFTAutoSuggestProps,
    AutoSuggestClassNameContract,
    DesignSystem
>;

export {
    AutoSuggest,
    AutoSuggestProps,
    AutoSuggestClassNameContract,
    AutoSuggestHandledProps,
    AutoSuggestUnhandledProps,
};
