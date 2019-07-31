import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { PaneClassNamesContract } from "./pane";

/**
 * The resize direction options: 'east' | 'west'
 */
export enum PaneResizeDirection {
    east = "east",
    west = "west",
}

export interface PaneManagedClasses extends ManagedClasses<PaneClassNamesContract> {}
export interface PaneUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface PaneHandledProps extends PaneManagedClasses {
    /**
     * The initial width of the pane
     * If less than minWidth, will respect minWidth
     * If greater than maxWidth, will respect maxWidth
     */
    initialWidth?: number;

    /**
     * The width of a pane when it is collapsed
     */
    collapsedWidth?: number;

    /**
     * The minimum width of the pane
     */
    minWidth?: number;

    /**
     * The maximum width of the pane
     */
    maxWidth?: number;

    /**
     * The width of the pane (fixed)
     * If less than minWidth, will respect minWidth
     * If greater than maxWidth, will respect maxWidth
     */
    width?: number;

    /**
     * Flag for if the column should be resizable
     */
    resizable?: boolean;

    /**
     * The id of the pane.
     */
    id?: string;

    /**
     * The collapsed state of the Pane
     */
    collapsed?: boolean;

    /**
     * Determines if this pane is overlaid
     */
    overlay?: boolean;

    /**
     * Set whether the pane should be hidden or not
     */
    hidden?: boolean;

    /**
     * Direction that the pane should be resized from
     */
    resizeFrom?: PaneResizeDirection;

    /**
     * The callback which is fired during resize
     */
    onResize?: (
        e: MouseEvent | React.KeyboardEvent<HTMLButtonElement>,
        width?: number
    ) => void;
}

export type PaneProps = PaneHandledProps & PaneUnhandledProps;
