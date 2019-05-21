import React from "react";
import {
    ManagedClasses,
    ViewportPositionerClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ViewportPositionerManagedClasses
    extends ManagedClasses<ViewportPositionerClassNameContract> {}
export interface ViewportPositionerUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export enum HorizontalPosition {
    left = "left",
    centerLeft = "centerLeft",
    centerRight = "centerRight",
    right = "right",
    uncontrolled = "uncontrolled",
}

export enum VerticalPosition {
    top = "top",
    middleTop = "middleTop",
    middleBottom = "middleBottom",
    bottom = "bottom",
    uncontrolled = "uncontrolled",
}

export enum AxisPositioningMode {
    uncontrolled = "uncontrolled",
    flipOutward = "flipOutward",
    flipInward = "flipInward",
}

export interface ViewportPositionerHandledProps extends ViewportPositionerManagedClasses {
    /**
     *  Ref to the element the positioner is anchored to
     */
    anchor?: React.RefObject<any>;

    /**
     *  Ref to the viewport the positioner is constrained to
     */
    viewport?: React.RefObject<any>;

    /**
     *  The positioning mode for the horizontal axis, default is uncontrolled
     */
    horizontalPositioningMode?: AxisPositioningMode;

    /**
     *  The default horizontal position, layout favors the widest option if unset
     */
    defaultHorizontalPosition?: HorizontalPosition;

    /**
     *  The width at which the positioner switches from the default position to the widest one
     */
    horizontalThreshold?: number;

    /**
     *  When enabled the positioner will not move out of the viewport on the horizontal axis
     */
    horizontalAlwaysInView?: boolean;

    /**
     *  The positioning mode for the vertical axis, default is uncontrolled
     */
    verticalPositioningMode?: AxisPositioningMode;

    /**
     * The default vertical position, layout favors the tallest option if unset
     */
    defaultVerticalPosition?: VerticalPosition;

    /**
     *  The height at which the positioner switches from the default position to the tallest one
     */
    verticalThreshold?: number;

    /**
     *  When enabled the positioner will not move out of the viewport on the vertical axis
     */
    verticalAlwaysInView?: boolean;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * When true the positioner remains fixed relative to it's anchor after the first render
     */
    fixedAfterInitialPlacement?: boolean;

    /**
     * The children of the viewport positioner
     */
    children?: React.ReactNode;
}

export type ViewportPositionerProps = ViewportPositionerHandledProps &
    ViewportPositionerUnhandledProps;
