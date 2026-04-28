import { Orientation } from "@microsoft/fast-web-utilities";
import type { ValuesOf } from "../utilities/index.js";

/**
 * Divider roles
 * @public
 */
export const DividerRole = {
    /**
     * The divider semantically separates content
     */
    separator: "separator",

    /**
     * The divider has no semantic value and is for visual presentation only.
     */
    presentation: "presentation",
} as const;

/**
 * The types for Divider roles
 * @public
 */
export type DividerRole = ValuesOf<typeof DividerRole>;

/**
 * Divider orientation
 * @public
 */
export const DividerOrientation = Orientation;

/**
 * The types for Divider orientation
 * @public
 */
export type DividerOrientation = ValuesOf<typeof DividerOrientation>;
