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
 * Generates HTML Element: \<fast-menu-item\>
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
        d="M7.38207 12.5594C6.84327 13.0308 6 12.6482 6 11.9322V4.06805C6 3.35208 6.84327 2.96943 7.38207 3.4409L11.5892 7.12209C12.1204 7.58695 12.1204 8.41329 11.5892 8.87815L7.38207 12.5594ZM7 11.5649L10.9307 8.12555C11.0066 8.05915 11.0066 7.94109 10.9307 7.87469L7 4.43534V11.5649Z"
      />
    </svg>

    `,
    radioIndicator: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="2"/>
    </svg>
    `,
});

/**
 * Styles for MenuItem
 * @public
 */
export const menuItemStyles = styles;

/**
 * Base class for MenuItem
 * @public
 */
export { MenuItem };
