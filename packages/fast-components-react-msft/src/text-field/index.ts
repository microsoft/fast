import * as React from "react";
import {
    IFoundationProps,
    ITextFieldClassNameContract,
    ITextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextField
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, TextFieldStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(TextFieldStyles)(TextField);
