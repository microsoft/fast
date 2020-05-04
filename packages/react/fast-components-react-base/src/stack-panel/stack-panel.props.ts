import React from "react";
import {
    ManagedClasses,
    StackPanelClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Orientation } from "@microsoft/fast-web-utilities";

export type StackPanelManagedClasses = ManagedClasses<StackPanelClassNameContract>;
export type StackPanelUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface StackPanelHandledProps extends StackPanelManagedClasses {
    /**
     * Whether items outside the viewport should be rendered or not
     * default is true
     */
    virtualize?: boolean;

    /**
     *  the indexes of children that should always be rendered
     */
    neverVirtualizeIndexes?: number[];

    /**
     * The default span of each item in pixels (width in horizontal orientation, height in vertical)
     * Provide a single value for panels where all items have the same value, or an array in the case where
     * items have varying spans.
     * default is 100
     */
    itemSpan?: number | number[];

    /**
     * How many items to preload before and after the range defined by viewportMaxHeight
     */
    preloadBufferLength?: number;

    /**
     * The orientation of the stackpanel
     */
    orientation?: Orientation;

    /**
     * Callback for when scroll or viewport span values change
     * This callback is triggered when the component mounts to report initial values
     * and is otherwise triggered by scroll or resize events.
     * newScrollValue: the scrollTop (or scrollLeft) of the scrolling container
     * scrollMaxValue: the maximum scroll value of the scrolling container
     * viewportSpan: the span in pixels of the scrolling container
     */
    onScrollChange?: (
        newScrollValue: number,
        scrollMaxValue: number,
        viewportSpan: number
    ) => void;

    /**
     * The index of the item initially in view
     */
    initiallyVisibleItemIndex?: number;

    /**
     * Delay in ms before viewport contents updated after scrolling stops
     * This allows developers to block updating children while scroll operations
     * are in progress
     * default is 0
     */
    scrollLayoutUpdateDelay?: number;
}

export type StackPanelProps = StackPanelHandledProps & StackPanelUnhandledProps;
