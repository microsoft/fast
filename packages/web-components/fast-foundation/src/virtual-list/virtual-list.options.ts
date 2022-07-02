/**
 * Defines what triggers the component to update layout.
 *
 * @public
 */
export type VirtualListAutoUpdateMode = "manual" | "viewport" | "auto" | "self";

/**
 * Defines how the idle load queue behaves.
 *
 * @public
 */
export type VirtualListIdleLoadMode = "auto" | "enabled" | "suspended";

/**
 * Defines the possible loading behaviors a Virtual List Item
 *
 * immediate: Sets loadContent to true on connect.
 *
 * manual: Developer takes ownership of setting loadContent, it will otherwise remain false.
 *
 * idle: The component will load content based on available idle time, this is the default.
 *
 * @public
 */
export type VirtualListItemLoadMode = "immediate" | "manual" | "idle";

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
