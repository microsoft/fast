import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Checkbox as BaseCheckbox,
    CheckboxProps as MSFTCheckboxProps,
    ICheckboxClassNameContract,
    ICheckboxHandledProps as IMSFTCheckboxHandledProps,
    ICheckboxManagedClasses,
    ICheckboxUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IManagedJSSProps, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CheckboxStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Checkbox = manageJss(CheckboxStyles)(BaseCheckbox);
type Checkbox = InstanceType<typeof Checkbox>;

interface ICheckboxHandledProps extends Subtract<IMSFTCheckboxHandledProps, ICheckboxManagedClasses> {}
type CheckboxProps = ManagedJSSProps<MSFTCheckboxProps, ICheckboxClassNameContract, IDesignSystem>;

export {
    Checkbox,
    CheckboxProps,
    ICheckboxHandledProps,
    ICheckboxUnhandledProps,
    ICheckboxClassNameContract
};
