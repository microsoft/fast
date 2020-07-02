import React from "react";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, SelectStyles } from "@microsoft/fast-components-styles-msft";
import MSFTSelect, {
    SelectHandledProps as MSFTSelectHandledProps,
    SelectProps as MSFTSelectProps,
    SelectManagedClasses,
    SelectUnhandledProps,
} from "./select";
import selectSchema from "./select.schema";
import selectSchema2 from "./select.schema.2";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Select = manageJss(SelectStyles)(MSFTSelect);
type Select = InstanceType<typeof Select>;

type SelectHandledProps = Subtract<MSFTSelectHandledProps, SelectManagedClasses>;
type SelectProps = ManagedJSSProps<
    MSFTSelectProps,
    SelectClassNameContract,
    DesignSystem
>;

export {
    Select,
    SelectProps,
    SelectClassNameContract,
    SelectHandledProps,
    selectSchema,
    selectSchema2,
    SelectUnhandledProps,
};
