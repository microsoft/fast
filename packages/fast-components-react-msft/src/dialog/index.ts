import * as React from "react";
import {
    Dialog,
    IDialogClassNameContract,
    IDialogHandledProps,
    IDialogUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { DialogStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

export default manageJss(DialogStyles)(Dialog);
