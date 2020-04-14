import React from "react";
import {
    DialogClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export type DialogUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
export type DialogManagedClasses = ManagedClasses<DialogClassNameContract>;
export interface DialogHandledProps extends DialogManagedClasses {
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
     * Defines where focus goes when the dialog is unmounted.
     * This is useful because modal dialogs will take focus back until that point in their life cycle.
     * The element or ref provided will be focused when the dialog unmounts.
     * Alternatively, providing a callback function gives developers more flexibility if needed.
     */
    focusTargetOnClose?: React.RefObject<any> | HTMLElement | (() => void);

    /**
     * The onDismiss callback
     * Callback is registered on click of the modal overlay or when escape key is pressed
     */
    onDismiss?: (e?: React.MouseEvent | KeyboardEvent | React.TouchEvent) => void;

    /**
     * Sets the visibility of the dialog to assistive technologies
     * If true, aria-hidden is false
     */
    visible?: boolean;
}

export type DialogProps = DialogHandledProps & DialogUnhandledProps;
