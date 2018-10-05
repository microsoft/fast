import * as React from "react";
import {
    Dialog as BaseDialog,
    DialogProps as BaseDialogProps,
    IDialogClassNameContract,
    IDialogHandledProps as IBaseDialogHandledProps,
    IDialogManagedClasses,
    IDialogUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DialogStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Dialog = manageJss(DialogStyles)(BaseDialog);
type Dialog = typeof Dialog;

interface IDialogHandledProps extends Subtract<IBaseDialogHandledProps, IDialogManagedClasses> {}
type DialogProps = ManagedJSSProps<BaseDialogProps, IDialogClassNameContract, IDesignSystem>;

export {
    Dialog,
    DialogProps,
    IDialogHandledProps,
    IDialogUnhandledProps,
    IDialogClassNameContract
};
