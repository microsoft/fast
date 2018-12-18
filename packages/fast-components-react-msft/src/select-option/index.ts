import React from "react";
import MSFTSelectOption, {
    SelectOptionHandledProps as MSFTSelectOptionHandledProps,
    SelectOptionManagedClasses,
    SelectOptionProps as MSFTSelectOptionProps,
    SelectOptionUnhandledProps,
} from "./select-option";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { SelectOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem, SelectOptionStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const SelectOption = manageJss(SelectOptionStyles)(MSFTSelectOption);
type SelectOption = InstanceType<typeof SelectOption>;

interface SelectOptionHandledProps
    extends Subtract<MSFTSelectOptionHandledProps, SelectOptionManagedClasses> {}
type SelectOptionProps = ManagedJSSProps<
    MSFTSelectOptionProps,
    SelectOptionClassNameContract,
    DesignSystem
>;

export {
    SelectOption,
    SelectOptionProps,
    SelectOptionClassNameContract,
    SelectOptionHandledProps,
    SelectOptionUnhandledProps,
};
