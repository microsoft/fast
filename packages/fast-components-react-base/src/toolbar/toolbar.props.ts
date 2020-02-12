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
     * The toolbar children
     */
    children?: React.ReactNode;

    /**
     * The index of the child which gets focused when the toolbar initially gets focus
     * If unset the toolbar will focus on the first valid focusable child.
     */
    initialFocusIndex?: number | number[];

    /**
     * Whether the toolbar is horizontal or vertical.  Default is horizontal.
     * Note that actual layout of the toolbar is controlled via css styling and
     * this prop mostly affects whether navigation is controlled by the up/down arrows
     * or the left/right arrows
     */
    orientation?: Orientation;
}

export type ToolbarProps = ToolbarHandledProps & ToolbarUnhandledProps;
