import { Menu, menuTemplate as template } from "@microsoft/fast-foundation";
import { menuStyles as styles } from "./menu.styles";

/**
 * The FAST Menu Element. Implements {@link @microsoft/fast-foundation#Menu},
 * {@link @microsoft/fast-foundation#menuTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-menu\>
 */
export const fastMenu = Menu.compose({
    baseName: "menu",
    template,
    styles,
});

/**
 * Styles for Menu
 * @public
 */
export const menuStyles = styles;
