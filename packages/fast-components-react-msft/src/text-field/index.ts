import * as React from "react";
import {
    IFoundationProps,
    ITextFieldClassNameContract,
    ITextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextField as BaseTextField
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, TextFieldStyles } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TextField = manageJss(TextFieldStyles)(BaseTextField);
type TextField = InstanceType<typeof TextField>;

export { TextField };
