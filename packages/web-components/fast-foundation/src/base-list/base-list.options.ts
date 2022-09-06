/**
 * Allows authors to control how the idle load queue behaves.
 *
 * @public
 */
export type ListIdleLoadMode = "auto" | "enabled" | "suspended";

/**
 * Defines the possible loading behaviors a List Item
 *
 * immediate: Sets loadContent to true on connect.
 *
 * manual: Developer takes ownership of setting loadContent, it will otherwise remain false.
 *
 * idle: The component will load content based on available idle time, this is the default.
 *
 * @public
 */
export type ListItemLoadMode = "immediate" | "manual" | "idle";
