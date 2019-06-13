import React from "react";
import { TextFieldClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTTextField, {
    TextFieldAppearance,
    TextFieldHandledProps as MSFTTextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldProps as MSFTTextFieldProps,
    TextFieldUnhandledProps,
} from "./text-field";
import textFieldSchema from "./text-field.schema";
import { TextFieldType } from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TextFieldStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TextField = manageJss(TextFieldStyles)(MSFTTextField);
type TextField = InstanceType<typeof TextField>;

interface TextFieldHandledProps
    extends Subtract<MSFTTextFieldHandledProps, TextFieldManagedClasses> {}
type TextFieldProps = ManagedJSSProps<
    MSFTTextFieldProps,
    TextFieldClassNameContract,
    DesignSystem
>;

export {
    TextFieldClassNameContract,
    TextFieldHandledProps,
    TextFieldUnhandledProps,
    TextField,
    TextFieldAppearance,
    TextFieldProps,
    textFieldSchema,
    TextFieldType,
};
