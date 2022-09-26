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
export type AnchorTarget = typeof AnchorTarget[keyof typeof AnchorTarget];
