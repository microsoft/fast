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
     * When true, the toolbar will immediately place focus on the appropriate focusable child when the toolbar mounts
     */
    enableAutoFocus?: boolean;

    /**
     * The index of the child which gets focused when the toolbar initially gets focus
     */
    initialFocusIndex?: number;

    /**
     * Whether the toolbar is horizontal or vertical.  Default is horizontal.
     * Note that actual layout of the toolbar is controlled via css styling and
     * this prop mostly affects whether navigation is controlled by the up/down arrows
     * or the left/right arrows
     */
    orientation?: Orientation;

    /**
     * The toolbar component will only pass focus to children who have been assigned valid aria roles -
     * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques
     * The default list isToolbar.DefaultFocusableRoles and contains most "widget" types.
     * Authors can pass their own list of valid roles instead.
     */
    focusableRoles?: string[];

    /**
     * Whether child items are focusable when disabled.
     * Detecting disabled elements is based onelements having a "aria-disabled" tag set to true when disabled
     * default is true
     */
    allowFocusOnDisabledItems?: boolean;
}

export type ToolbarProps = ToolbarHandledProps & ToolbarUnhandledProps;
