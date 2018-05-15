import Row from "./Row";
import Canvas from "./Canvas";

/**
 * Possible justify options: 'center' | 'start' | 'end' | 'space-around' | 'space-between'
 * @name RowJustify
 * @typedef {RowJustify}
 * @type {string}
 */
export type RowJustify = "center" | "start" | "end" | "space-around" | "space-between";

/**
 * Defines the possible props for the Row component
 * @interface
 */
export interface IRowProps {
    /**
     * How to justify child content
     * @name justify
     * @type {RowJustify}
     */
    justify?: RowJustify;

    /**
     * Causes the row to fill all available vertical space
     * @name fill
     * @type {boolean}
     */
    fill?: boolean;

    // TODO: can we limit row children to Canvas and Pane?
}
