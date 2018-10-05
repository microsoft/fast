import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    ITextFieldClassNameContract,
    ITextFieldHandledProps as IBaseTextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextField as BaseTextField,
    TextFieldProps as BaseTextFieldProps,
    TextFieldType
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, TextFieldStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TextField = manageJss(TextFieldStyles)(BaseTextField);
type TextField = typeof TextField;

interface ITextFieldHandledProps extends Subtract<IBaseTextFieldHandledProps, ITextFieldManagedClasses> {}
type TextFieldProps = ManagedJSSProps<BaseTextFieldProps, ITextFieldClassNameContract, IDesignSystem>;

export {
    ITextFieldClassNameContract,
    ITextFieldHandledProps,
    ITextFieldUnhandledProps,
    TextField,
    TextFieldProps,
    TextFieldType
};
