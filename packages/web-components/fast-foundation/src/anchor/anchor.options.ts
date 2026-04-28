import type { ValuesOf } from "../utilities/index.js";

/**
 * Anchor target values.
 *
 * @public
 */
export const AnchorTarget = {
    _self: "_self",
    _blank: "_blank",
    _parent: "_parent",
    _top: "_top",
} as const;

/**
 * Type for anchor target values.
 *
 * @public
 */
export type AnchorTarget = ValuesOf<typeof AnchorTarget>;
