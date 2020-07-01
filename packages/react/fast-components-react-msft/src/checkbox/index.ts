import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Checkbox as BaseCheckbox,
    CheckboxClassNameContract,
    CheckboxManagedClasses,
    CheckboxSlot,
    CheckboxUnhandledProps,
    CheckboxHandledProps as MSFTCheckboxHandledProps,
    CheckboxProps as MSFTCheckboxProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { CheckboxStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import checkboxSchema from "./checkbox.schema";
import checkboxSchema2 from "./checkbox.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Checkbox = manageJss(CheckboxStyles)(BaseCheckbox);
type Checkbox = InstanceType<typeof Checkbox>;

type CheckboxHandledProps = Subtract<MSFTCheckboxHandledProps, CheckboxManagedClasses>;
type CheckboxProps = ManagedJSSProps<
    MSFTCheckboxProps,
    CheckboxClassNameContract,
    DesignSystem
>;

export {
    Checkbox,
    CheckboxProps,
    CheckboxHandledProps,
    checkboxSchema,
    checkboxSchema2,
    CheckboxUnhandledProps,
    CheckboxClassNameContract,
    CheckboxSlot,
};
