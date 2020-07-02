import React from "react";
import {
    Dialog as BaseDialog,
    DialogHandledProps as BaseDialogHandledProps,
    DialogProps as BaseDialogProps,
    DialogClassNameContract,
    DialogManagedClasses,
    DialogUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, DialogStyles } from "@microsoft/fast-components-styles-msft";
import dialogSchema from "./dialog.schema";
import dialogSchema2 from "./dialog.schema.2";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Dialog = manageJss(DialogStyles)(BaseDialog);
type Dialog = InstanceType<typeof Dialog>;

type DialogHandledProps = Subtract<BaseDialogHandledProps, DialogManagedClasses>;
type DialogProps = ManagedJSSProps<
    BaseDialogProps,
    DialogClassNameContract,
    DesignSystem
>;

export {
    Dialog,
    DialogProps,
    DialogHandledProps,
    dialogSchema,
    dialogSchema2,
    DialogUnhandledProps,
    DialogClassNameContract,
};
