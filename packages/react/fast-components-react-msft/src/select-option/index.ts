import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { SelectOptionClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem, SelectOptionStyles } from "@microsoft/fast-components-styles-msft";
import selectOptionSchema from "./select-option.schema";
import selectOptionSchema2 from "./select-option.schema.2";
import MSFTSelectOption, {
    SelectOptionHandledProps as MSFTSelectOptionHandledProps,
    SelectOptionProps as MSFTSelectOptionProps,
    SelectOptionManagedClasses,
    SelectOptionUnhandledProps,
} from "./select-option";

const SelectOption = manageJss(SelectOptionStyles)(MSFTSelectOption);
type SelectOption = InstanceType<typeof SelectOption>;

type SelectOptionHandledProps = Subtract<
    MSFTSelectOptionHandledProps,
    SelectOptionManagedClasses
>;
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
    selectOptionSchema,
    selectOptionSchema2,
    SelectOptionUnhandledProps,
};
