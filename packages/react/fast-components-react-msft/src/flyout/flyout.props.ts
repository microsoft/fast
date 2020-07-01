import React from "react";
import {
    AxisPositioningMode,
    ViewportPositionerHandledProps,
    ViewportPositionerHorizontalPosition,
    ViewportPositionerManagedClasses,
    ViewportPositionerUnhandledProps,
    ViewportPositionerVerticalPosition,
} from "@microsoft/fast-components-react-base";
import {
    FlyoutClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export enum FlyoutHorizontalPosition {
    left = ViewportPositionerHorizontalPosition.left,
    right = ViewportPositionerHorizontalPosition.right,
    uncontrolled = ViewportPositionerHorizontalPosition.uncontrolled,
}

export enum FlyoutVerticalPosition {
    top = ViewportPositionerVerticalPosition.top,
    bottom = ViewportPositionerVerticalPosition.bottom,
    uncontrolled = ViewportPositionerVerticalPosition.uncontrolled,
}

export enum FlyoutAxisPositioningMode {
    uncontrolled = AxisPositioningMode.uncontrolled,
    adjacent = AxisPositioningMode.adjacent,
    inset = AxisPositioningMode.inset,
}

interface ViewportPositionerSubtractedProps extends ViewportPositionerManagedClasses {
    defaultVerticalPosition?: ViewportPositionerVerticalPosition;
    defaultHorizontalPosition?: ViewportPositionerHorizontalPosition;
    horizontalPositioningMode?: AxisPositioningMode;
    verticalPositioningMode?: AxisPositioningMode;
    disabled?: boolean;
    anchor?: React.RefObject<any> | HTMLElement;
}

export type FlyoutManagedClasses = ManagedClasses<FlyoutClassNameContract>;
export interface FlyoutHandledProps
    extends Subtract<ViewportPositionerHandledProps, ViewportPositionerSubtractedProps>,
        FlyoutManagedClasses {
    /**
     *  Reference to the element the positioner is anchored to
     */
    anchor: React.RefObject<any> | HTMLElement;

    /**
     * The default vertical position, layout favors the tallest option if unset
     */
    defaultVerticalPosition?: FlyoutVerticalPosition;

    /**
     *  The default horizontal position, layout favors the widest option if unset
     */
    defaultHorizontalPosition?: FlyoutHorizontalPosition;

    /**
     *  The positioning mode for the horizontal axis, default is uncontrolled
     */
    horizontalPositioningMode?: FlyoutAxisPositioningMode;

    /**
     *  The positioning mode for the vertical axis, default is uncontrolled
     */
    verticalPositioningMode?: FlyoutAxisPositioningMode;

    /**
     * When true the child of the flyout will not be rendered until the component has been positioned
     * relative to its anchor.  This may be useful in cases where the browser auto scrolls to bring a
     * focused child into view before it has been positioned, for example.  Default is false.
     * This flag may be removed in a future version and become the default behavior.
     */
    delayContentInstanciation?: boolean;

    /**
     *  The flyout height
     */
    height?: string;

    /**
     *  The flyout width
     */
    width?: string;

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
     * The onDismiss callback
     * Callback is registered on click of the window or when escape key is pressed
     */
    onDismiss?: (e?: MouseEvent | KeyboardEvent) => void;

    /**
     * Sets the visibility of the flyout
     */
    visible?: boolean;
}

export type FlyoutUnhandledProps = ViewportPositionerUnhandledProps;
export type FlyoutProps = FlyoutHandledProps & FlyoutUnhandledProps;
