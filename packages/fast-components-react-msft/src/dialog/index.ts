import * as React from "react";
import {
    Dialog as BaseDialog,
    DialogClassNameContract,
    DialogHandledProps as BaseDialogHandledProps,
    DialogManagedClasses,
    DialogProps as BaseDialogProps,
    DialogUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, DialogStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Dialog = manageJss(DialogStyles)(BaseDialog);
type Dialog = typeof Dialog;

interface DialogHandledProps
    extends Subtract<BaseDialogHandledProps, DialogManagedClasses> {}
type DialogProps = ManagedJSSProps<
    BaseDialogProps,
    DialogClassNameContract,
    DesignSystem
>;

export {
    Dialog,
    DialogProps,
    DialogHandledProps,
    DialogUnhandledProps,
    DialogClassNameContract
};
