import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Checkbox as BaseCheckbox,
    CheckboxClassNameContract,
    CheckboxHandledProps as MSFTCheckboxHandledProps,
    CheckboxManagedClasses,
    CheckboxProps as MSFTCheckboxProps,
    CheckboxUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CheckboxStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Checkbox = manageJss(CheckboxStyles)(BaseCheckbox);
type Checkbox = typeof Checkbox;

interface CheckboxHandledProps extends Subtract<MSFTCheckboxHandledProps, CheckboxManagedClasses> {}
type CheckboxProps = ManagedJSSProps<MSFTCheckboxProps, CheckboxClassNameContract, DesignSystem>;

export {
    Checkbox,
    CheckboxProps,
    CheckboxHandledProps,
    CheckboxUnhandledProps,
    CheckboxClassNameContract
};
