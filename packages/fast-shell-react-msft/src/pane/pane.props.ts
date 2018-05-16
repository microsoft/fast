import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import { IPaneClassNamesContract } from "./pane";

/**
 * The resize direction options: 'east' | 'west'
 */
export enum PaneResizeDirection {
    east = "east",
    west = "west"
}

/**
 * Callback for when the width of the pane should change
 */
export type PaneOnWidthChange = (width: number, id: string) => void;

export interface IPaneHandledProps {
    /**
     * The minimum width of the pane
     */
    minWidth?: number;

    /**
     * The maximum width of the pane
     */
    maxWidth?: number;

    /**
     * The initial width of the pane
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
     * Action creator to update width of pane
     */
    onWidthChange?: PaneOnWidthChange;

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
}

export interface IPaneUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface IPaneManagedClasses extends IManagedClasses<IPaneClassNamesContract> {}
export type PaneProps = IPaneHandledProps & IPaneUnhandledProps & IPaneManagedClasses;
