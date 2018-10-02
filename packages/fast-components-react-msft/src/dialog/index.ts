import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Dialog as BaseDialog,
    IDialogClassNameContract,
    IDialogHandledProps,
    IDialogUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { DialogStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Dialog = manageJss(DialogStyles)(BaseDialog);
type Dialog = InstanceType<typeof Dialog>;

export { Dialog };
