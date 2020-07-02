import React from "react";
import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { AutoSuggestStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTAutoSuggest, {
    AutoSuggestManagedClasses,
    AutoSuggestUnhandledProps,
    AutoSuggestHandledProps as MSFTAutoSuggestHandledProps,
    AutoSuggestProps as MSFTAutoSuggestProps,
} from "./auto-suggest";
import autoSuggestSchema from "./auto-suggest.schema";
import autoSuggestSchema2 from "./auto-suggest.schema.2";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const AutoSuggest = manageJss(AutoSuggestStyles)(MSFTAutoSuggest);
type AutoSuggest = InstanceType<typeof AutoSuggest>;

type AutoSuggestHandledProps = Subtract<
    MSFTAutoSuggestHandledProps,
    AutoSuggestManagedClasses
>;
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
    autoSuggestSchema,
    autoSuggestSchema2,
    AutoSuggestUnhandledProps,
};
