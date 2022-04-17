import { Menu, menuTemplate as template } from "@microsoft/fast-foundation";
import { menuStyles as styles } from "./menu.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Menu} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-menu>`
 */
export const fastMenu = Menu.compose({
    baseName: "menu",
    template,
    styles,
});

/**
 * Base class for Menu
 * @public
 */
export { Menu };

export { styles as menuStyles };
