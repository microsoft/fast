import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    TextField as BaseTextField,
    TextFieldClassNameContract,
    TextFieldHandledProps as BaseTextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldProps as BaseTextFieldProps,
    TextFieldType,
    TextFieldUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TextFieldStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TextField = manageJss(TextFieldStyles)(BaseTextField);
type TextField = InstanceType<typeof TextField>;

interface TextFieldHandledProps
    extends Subtract<BaseTextFieldHandledProps, TextFieldManagedClasses> {}
type TextFieldProps = ManagedJSSProps<
    BaseTextFieldProps,
    TextFieldClassNameContract,
    DesignSystem
>;

export {
    TextFieldClassNameContract,
    TextFieldHandledProps,
    TextFieldUnhandledProps,
    TextField,
    TextFieldProps,
    TextFieldType,
};
