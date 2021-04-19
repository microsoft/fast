import { Menu, MenuTemplate as template } from "@microsoft/fast-foundation";
import { MenuStyles as styles } from "./menu.styles";

/**
 * The FAST Menu Element. Implements {@link @microsoft/fast-foundation#Menu},
 * {@link @microsoft/fast-foundation#MenuTemplate}
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
export const MenuStyles = styles;
