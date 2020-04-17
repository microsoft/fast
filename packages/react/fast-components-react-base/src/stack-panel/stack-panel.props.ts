import React from "react";
import {
    ManagedClasses,
    StackPanelClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Orientation } from "@microsoft/fast-web-utilities";

export interface StackPanelManagedClasses
    extends ManagedClasses<StackPanelClassNameContract> {}
export interface StackPanelUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

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
     * Callback for when scroll values change
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
