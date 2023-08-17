/**
 * Defines what triggers the component to update layout.
 *
 * @public
 */
export type VirtualListAutoUpdateMode = "manual" | "viewport" | "auto" | "self";

/**
 * Used to describe the position of an element within the list
 *
 * @public
 */
export interface SizeMap {
    // start position
    start: number;

    // end position
    end: number;

    // list item size
    size: number;
}
