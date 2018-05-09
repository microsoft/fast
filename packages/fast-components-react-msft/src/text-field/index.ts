import * as React from "react";
import {
    IFoundationProps,
    ITextfieldClassNameContract,
    ITextfieldHandledProps,
    ITextfieldManagedClasses,
    ITextfieldUnhandledProps,
    TextField
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, TextfieldStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(TextfieldStyles)(TextField);
