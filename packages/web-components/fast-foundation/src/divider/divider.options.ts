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
export type DividerRole = typeof DividerRole[keyof typeof DividerRole];
