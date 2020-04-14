import React from "react";
import {
    ManagedClasses,
    ViewportPositionerClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export type ViewportPositionerManagedClasses = ManagedClasses<
    ViewportPositionerClassNameContract
>;
export type ViewportPositionerUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export enum ViewportPositionerHorizontalPosition {
    left = "left",
    right = "right",
    uncontrolled = "uncontrolled",
}

export enum ViewportPositionerVerticalPosition {
    top = "top",
    bottom = "bottom",
    uncontrolled = "uncontrolled",
}

export enum AxisPositioningMode {
    uncontrolled = "uncontrolled",
    adjacent = "adjacent",
    inset = "inset",
}

export interface ViewportPositionerHandledProps extends ViewportPositionerManagedClasses {
    /**
     *  Ref to the element the positioner is anchored to
     */
    anchor?: React.RefObject<any> | HTMLElement;

    /**
     *  Ref to the viewport the positioner is constrained to
     */
    viewport?: React.RefObject<any> | HTMLElement;

    /**
     *  The positioning mode for the horizontal axis, default is uncontrolled
     */
    horizontalPositioningMode?: AxisPositioningMode;

    /**
     *  The default horizontal position, layout favors the widest option if unset
     */
    defaultHorizontalPosition?: ViewportPositionerHorizontalPosition;

    /**
     *  The width at which the positioner switches from the default position to the widest one
     */
    horizontalThreshold?: number;

    /**
     *  When enabled the positioner will not move out of the viewport on the horizontal axis
     */
    horizontalAlwaysInView?: boolean;

    /**
     *  Locks horizontal axis to default position
     */
    horizontalLockToDefault?: boolean;

    /**
     *  The positioning mode for the vertical axis, default is uncontrolled
     */
    verticalPositioningMode?: AxisPositioningMode;

    /**
     * The default vertical position, layout favors the tallest option if unset
     */
    defaultVerticalPosition?: ViewportPositionerVerticalPosition;

    /**
     *  The height at which the positioner switches from the default position to the tallest one
     */
    verticalThreshold?: number;

    /**
     *  When enabled the positioner will not move out of the viewport on the vertical axis
     */
    verticalAlwaysInView?: boolean;

    /**
     *  Locks vertical axis to default position
     */
    verticalLockToDefault?: boolean;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * When true the positioner remains fixed relative to it's anchor after the first render
     */
    fixedAfterInitialPlacement?: boolean;

    /**
     * Whether the positioner should scale to fill all the available space relative to the anchor.
     * Otherwise the positioner is sized to match content.  Default is false.
     */
    scaleToFit?: boolean;

    /**
     * The children of the viewport positioner
     */
    children?: React.ReactNode;

    /**
     * When true the child of the positioner will not be rendered until the component has been positioned
     * relative to its anchor.  This may be useful in cases where the browser auto scrolls to bring a
     * focused child into view before it has been positioned, for example.  Default is false.
     * This flag may be removed in a future version and become the default behavior.
     */
    delayContentInstanciation?: boolean;
}

export type ViewportPositionerProps = ViewportPositionerHandledProps &
    ViewportPositionerUnhandledProps;
