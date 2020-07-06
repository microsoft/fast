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

export interface PaneResizeControlProps {
    /**
     * The className passed to the resize handler
     */
    className?: string;

    /**
     * The mouse down event handler
     */
    onMouseDown?: (e?: React.MouseEvent<HTMLButtonElement>) => void;

    /**
     * The keydown event handler
     */
    onKeyDown?: (e?: React.KeyboardEvent<HTMLButtonElement>) => void;

    /**
     * The accessible role for the resize handler
     */
    role?: string;

    /**
     * The minimum resize value
     */
    valueMin?: number;

    /**
     * The maximum resize value
     */
    valueMax?: number;

    /**
     * The current resize value
     */
    valueNow?: number;
}

export type PaneManagedClasses = ManagedClasses<PaneClassNamesContract>;
export type PaneUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
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

    /**
     * The optional custom resize handler
     */
    resizeControl?: (props: PaneResizeControlProps) => React.ReactNode;
}

export type PaneProps = PaneHandledProps & PaneUnhandledProps;
