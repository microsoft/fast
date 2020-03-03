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
     * Ref to the child which gets focused when the toolbar initially gets focus
     * If unset the toolbar will focus on the first valid focusable child.
     */
    initialFocusTarget?: React.RefObject<any>;

    /**
     * Whether the toolbar is horizontal or vertical. This prop determines whether navigation is controlled by the up/down arrows
     * or the left/right arrows and also applies css classes for styling
     */
    orientation?: Orientation;
}

export type ToolbarProps = ToolbarHandledProps & ToolbarUnhandledProps;
