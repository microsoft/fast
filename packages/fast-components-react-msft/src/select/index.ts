import * as React from "react";
import { SelectClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, SelectStyles } from "@microsoft/fast-components-styles-msft";
import MSFTSelect, {
    SelectHandledProps as MSFTSelectHandledProps,
    SelectManagedClasses,
    SelectProps as MSFTSelectProps,
    SelectUnhandledProps,
} from "./select";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Select = manageJss(SelectStyles)(MSFTSelect);
type Select = InstanceType<typeof Select>;

interface SelectHandledProps
    extends Subtract<MSFTSelectHandledProps, SelectManagedClasses> {}
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
    SelectUnhandledProps,
};
