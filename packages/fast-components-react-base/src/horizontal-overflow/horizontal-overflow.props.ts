import * as React from "react";
import {
    HorizontalOverflowClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Scroll interface for consumers
 * 'start' is when the horizontal overflow scroll is all the way left in LTR (all the way right in RTL)
 * 'end' is when the horizontal overflow scroll is all the right in LTR (all the way left in RTL)
 * TODO #1177: Change interface property names to be more meaningful
 */
export interface PositionChange {
    start: boolean;
    end: boolean;
}

/**
 * Overflow interface for consumers
 * When both are false, there is no overflow
 * When both are true, there is overflow on either side
 * 'overflowStart' is true when there are items to the left in LTR (right in RTL)
 * 'overflowEnd' is true when there are items to the right in LTR (left in RTL)
 */
export interface OverflowChange {
    overflowStart: boolean;
    overflowEnd: boolean;
}

export interface HorizontalOverflowUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}
export interface HorizontalOverflowManagedClasses
    extends ManagedClasses<HorizontalOverflowClassNameContract> {}
export interface HorizontalOverflowHandledProps extends HorizontalOverflowManagedClasses {
    /**
     * The horizontal overflow content
     */
    children?: React.ReactNode | React.ReactNode[];

    /**
     * The duration the scroll movement should last
     */
    scrollDuration?: number;

    /**
     * Callback for on overflow change
     * Use `onOverflowChange` to know if there are enough items to cause overflow, and where the overflow occurs
     */
    onOverflowChange?: (overflowObject: OverflowChange) => void;

    /**
     * Callback for on scroll change
     * Use `onScrollChange` to receive if scroll is at the start or end of the overflow set
     */
    onScrollChange?: (scrollObject: PositionChange) => void;
}

export type HorizontalOverflowProps = HorizontalOverflowHandledProps &
    HorizontalOverflowUnhandledProps;
