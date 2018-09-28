import * as React from "react";
import { IDialogClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IDialogUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IDialogManagedClasses extends IManagedClasses<IDialogClassNameContract> {}
export interface IDialogHandledProps extends IDialogManagedClasses {
    /**
     * The dialog content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The dialog content width
     */
    contentWidth?: string;

    /**
     * The dialog content height
     */
    contentHeight?: string;

    /**
     * The aria-describedby attribute to link the dialog to an
     * element that describes its purpose
     */
    describedBy?: string;

    /**
     * The aria-label to provide an accessible name for the dialog
     */
    label?: string;

    /**
     * The aria-labelledby attribute to link the dialog to an existing
     * element that provides it an accessible name
     */
    labelledBy?: string;

    /**
     * The option to add modal functionality and prevent a user
     * from interacting with elements outside the dialog
     */
    modal?: boolean;

    /**
     * The onDismiss callback
     * Callback is registered on click of the modal overlay or when escape key is pressed
     */
    onDismiss?: (e?: React.MouseEvent | KeyboardEvent) => void;

    /**
     * Sets the visibility of the dialog to assistive technologies
     * If true, aria-hidden is false
     */
    visible?: boolean;
}

export type DialogProps = IDialogHandledProps & IDialogUnhandledProps & IDialogManagedClasses;
