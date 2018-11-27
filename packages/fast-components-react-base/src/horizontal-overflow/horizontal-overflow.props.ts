import * as React from "react";
import {
    HorizontalOverflowClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

/**
 * Scroll interface for consumers
 * 'start' is when the horizontal overflow scroll is all the way left in LTR (all the way right in RTL)
 * 'end' is when the horizontal overflow scroll is all the right in LTR (all the way left in RTL)
 */
export interface ScrollChange {
    start: boolean;
    end: boolean;
}

/**
 * Overflow interface for consumers
 * Includes all properties found in ScrollChange
 * 'overflow' is true when there are enough items to cause overflow
 */
export interface OverflowChange extends ScrollChange {
    overflow: boolean;
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
     * Use `onOverflowChange` to know if there are enough items to cause overflow
     */
    onOverflowChange?: (overflowObject: OverflowChange) => void;

    /**
     * Callback for on scroll change
     * Use `onScrollChange` to receive if scroll is at the start or end of the overflow set
     */
    onScrollChange?: (scrollObject: ScrollChange) => void;
}

export type HorizontalOverflowProps = HorizontalOverflowHandledProps &
    HorizontalOverflowUnhandledProps;
