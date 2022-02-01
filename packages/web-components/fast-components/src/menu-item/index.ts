import {
    MenuItem,
    MenuItemOptions,
    menuItemTemplate as template,
} from "@microsoft/fast-foundation";
import { menuItemStyles as styles } from "./menu-item.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#MenuItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-menu-item>`
 */
export const fastMenuItem = MenuItem.compose<MenuItemOptions>({
    baseName: "menu-item",
    template,
    styles,
    checkboxIndicator: `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>
        </svg>
    `,
    expandCollapseGlyph: `
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.57 11.84A1 1 0 0 1 6 11.02V4.98a1 1 0 0 1 1.57-.82l3.79 2.62c.85.59.85 1.85 0 2.44l-3.79 2.62ZM7 11.02l3.78-2.61a.5.5 0 0 0 0-.82L7 4.98v6.04Z"
          />
      </svg>
    `,
    radioIndicator: `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>
        </svg>
    `,
});

/**
 * Base class for MenuItem
 * @public
 */
export { MenuItem };

export { styles as menuItemStyles };
