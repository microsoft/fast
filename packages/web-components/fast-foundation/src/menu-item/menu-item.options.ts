import type { StartEndOptions } from "../patterns/start-end.js";
import type { SyntheticViewTemplate } from "@microsoft/fast-element";

/**
 * Types of menu item column count.
 * @public
 */
export type MenuItemColumnCount = 0 | 1 | 2;

/**
 * Menu Item configuration options
 * @public
 */
export type MenuItemOptions = StartEndOptions & {
    checkboxIndicator?: string | SyntheticViewTemplate;
    expandCollapseGlyph?: string | SyntheticViewTemplate;
    radioIndicator?: string | SyntheticViewTemplate;
};

/**
 * Menu items roles.
 * @public
 */
export const MenuItemRole = {
    /**
     * The menu item has a "menuitem" role
     */
    menuitem: "menuitem",

    /**
     * The menu item has a "menuitemcheckbox" role
     */
    menuitemcheckbox: "menuitemcheckbox",

    /**
     * The menu item has a "menuitemradio" role
     */
    menuitemradio: "menuitemradio",
} as const;

/**
 * The types for menu item roles
 * @public
 */
export type MenuItemRole = typeof MenuItemRole[keyof typeof MenuItemRole];

/**
 * @internal
 */
export const roleForMenuItem: {
    [value in keyof typeof MenuItemRole]: typeof MenuItemRole[value];
} = {
    [MenuItemRole.menuitem]: "menuitem",
    [MenuItemRole.menuitemcheckbox]: "menuitemcheckbox",
    [MenuItemRole.menuitemradio]: "menuitemradio",
};

/**
 * Enumerates possible submenu positions
 *
 * @public
 */
export const SubmenuPosition = {
    /**
     * The submenu is positioned above the element
     */
    top: "top",

    /**
     * The submenu is positioned above the element and and in the logical start position
     */
    topStart: "top-start",

    /**
     * The submenu is positioned above the element and in the logical end position
     */
    topEnd: "top-end",

    /**
     * The submenu is positioned to the right of the element
     */
    right: "right",

    /**
     * The submenu is positioned to the right the element and in the logical start position
     */
    rightStart: "right-start",

    /**
     * The submenu is positioned to the right of the element and in the logical end position
     */
    rightEnd: "right-end",

    /**
     * The submenu is positioned below the element
     */
    bottom: "bottom",

    /**
     * The submenu is positioned below the element and and in the logical start position
     */
    bottomStart: "bottom-start",

    /**
     * The submenu is positioned below the element and in the logical end position
     */
    bottomEnd: "bottom-end",

    /**
     * The submenu is positioned to the left of the element
     */
    left: "left",

    /**
     * The submenu is positioned to the left the element and in the logical start position
     */
    leftStart: "left-start",

    /**
     * The submenu is positioned to the left of the element and in the logical end position
     */
    leftEnd: "left-end",
} as const;

/**
 * The possible submenu positions
 *
 * @public
 */
export type SubmenuPosition = typeof SubmenuPosition[keyof typeof SubmenuPosition];
