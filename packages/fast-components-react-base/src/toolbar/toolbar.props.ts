import React from "react";
import {
    ManagedClasses,
    ToolbarClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { Orientation } from "@microsoft/fast-web-utilities";

export interface ToolbarManagedClasses extends ManagedClasses<ToolbarClassNameContract> {}
export interface ToolbarUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ToolbarHandledProps extends ToolbarManagedClasses {
    /**
     * The index of the child which gets focused when the toolbar initially gets focus
     * If unset the toolbar will focus on the first valid focusable child.
     * In toolbars with nested item groups the index can be described with an array
     * indicating the the index of the child group(s) in succession
     * ie. [1, 3] places focus on child at index 3 of a group at index 1 of the toolbar root.
     */
    initialFocusIndex?: number | number[];

    /**
     * Whether the toolbar is horizontal or vertical. This prop determines whether navigation is controlled by the up/down arrows
     * or the left/right arrows and also applies css classes for styling
     */
    orientation?: Orientation;
}

export type ToolbarProps = ToolbarHandledProps & ToolbarUnhandledProps;
