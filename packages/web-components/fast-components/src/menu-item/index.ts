import { MenuItem, MenuItemTemplate as template } from "@microsoft/fast-foundation";
import { MenuItemStyles as styles } from "./menu-item.styles";

/**
 * The FAST Menu Item Element. Implements {@link @microsoft/fast-foundation#MenuItem},
 * {@link @microsoft/fast-foundation#MenuItemTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-menu-item\>
 */
export const FASTMenuItem = MenuItem.compose({
    baseName: "menu-item",
    template,
    styles,
});

/**
 * Styles for MenuItem
 * @public
 */
export const MenuItemStyles = styles;
