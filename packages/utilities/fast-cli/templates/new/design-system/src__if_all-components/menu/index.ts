import { Menu, menuTemplate as template } from "@microsoft/fast-foundation";
import { menuStyles as styles } from "./menu.styles";

/**
 * A function that returns a Menu registration for configuring the component with a DesignSystem.
 * Implements Menu
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-menu\>
 */
export const /* @echo namespace */Menu = Menu.compose({
    baseName: "menu",
    template,
    styles,
});

/**
 * Styles for Menu
 * @public
 */
export const menuStyles = styles;

/**
 * Base class for Menu
 * @public
 */
export { Menu };
