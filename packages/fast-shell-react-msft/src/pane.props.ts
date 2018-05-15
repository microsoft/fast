import * as React from "react";
import Pane from "./pane";

export interface IPaneProps {
    /**
     * The minimum width of the pane
     * @name minWidth
     * @type {number}
     */
    minWidth?: number;

    /**
     * The maximum width of the pane
     * @name maxWidth
     * @type {number}
     */
    maxWidth?: number;

    /**
     * The initial width of the pane
     * @name width
     * @type {number}
     */
    width?: number;

    /**
     * Flag for if the column should be resizable
     * @name resizable
     * @type {boolean}
     */
    resizable?: boolean;

    /**
     * The id of the pane.
     * @name id
     * @type {string}
     */
    id?: string;

    /**
     * The collapsed state of the Pane
     * @name collapsed
     * @type {boolean}
     */
    collapsed?: boolean;

    /**
     * Action creator to update width of pane
     * @name onWidthChange
     * @type {PaneOnWidthChange}
     */
    onWidthChange?: PaneOnWidthChange;

    /**
     * Determines if this pane is overlaid
     * @name overlay
     * @type {boolean}
     */
    overlay?: boolean;

    /**
     * Set whether the pane should be hidden or not
     * @name hidden
     * @type {boolean}
     */
    hidden?: boolean;

    /**
     * Direction that the pane should be resized from
     * @name resizeFrom
     * @type {PaneResizeFrom}
     */
    resizeFrom?: PaneResizeFrom;
}

/**
 * The resize direction options: 'east' | 'west'
 * @name PaneResizeFrom
 * @typedef {PaneResizeFrom}
 * @type {string}
 */
export type PaneResizeFrom = "east" | "west";

/**
 * Callback for when the width of the pane should change
 * @name PaneOnWidthChange
 * @typedef {PaneOnWidthChange}
 * @type {function}
 */
export type PaneOnWidthChange = (width: number, id: string) => void;
