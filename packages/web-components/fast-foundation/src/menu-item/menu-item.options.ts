/**
 * Menu items roles.
 * @public
 */
export enum MenuItemRole {
    /**
     * The menu item has a "menuitem" role
     */
    menuitem = "menuitem",

    /**
     * The menu item has a "menuitemcheckbox" role
     */
    menuitemcheckbox = "menuitemcheckbox",

    /**
     * The menu item has a "menuitemradio" role
     */
    menuitemradio = "menuitemradio",
}

/**
 * @internal
 */
export const roleForMenuItem: { [value in MenuItemRole]: keyof typeof MenuItemRole } = {
    [MenuItemRole.menuitem]: "menuitem",
    [MenuItemRole.menuitemcheckbox]: "menuitemcheckbox",
    [MenuItemRole.menuitemradio]: "menuitemradio",
};
