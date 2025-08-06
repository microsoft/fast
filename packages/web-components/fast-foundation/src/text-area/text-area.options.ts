import type { ValuesOf } from "../utilities/index.js";

/**
 * Resize mode for a TextArea
 * @public
 */
export const TextAreaResize = {
    /**
     * No resize.
     */
    none: "none",

    /**
     * Resize vertically and horizontally.
     */
    both: "both",

    /**
     * Resize horizontally.
     */
    horizontal: "horizontal",

    /**
     * Resize vertically.
     */
    vertical: "vertical",
} as const;

/**
 * Types for the Text Area resize mode
 * @public
 */
export type TextAreaResize = ValuesOf<typeof TextAreaResize>;
