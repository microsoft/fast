import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    ITextFieldClassNameContract,
    ITextFieldHandledProps as IBaseTextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextField as BaseTextField,
    TextFieldProps as BaseTextFieldProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, TextFieldStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TextField = manageJss(TextFieldStyles)(BaseTextField);
type TextField = InstanceType<typeof TextField>;

interface ITextFieldHandledProps extends Subtract<IBaseTextFieldHandledProps, ITextFieldManagedClasses> {}
type TextFieldProps = JSSManagerProps<BaseTextFieldProps, ITextFieldClassNameContract, IDesignSystem>;

export {
    TextField,
    TextFieldProps,
    ITextFieldHandledProps,
    ITextFieldUnhandledProps,
    ITextFieldClassNameContract
};
