import {
    VirtualList,
    VirtualListItem,
    virtualListItemTemplate,
    virtualListTemplate,
} from "@microsoft/fast-foundation";
import { virtualListStyles } from "./virtual-list.styles.js";
import { virtualListItemStyles } from "./virtual-list-item.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#VirtualList} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#virtualListTemplate}
 *
 *
 * @beta
 * @remarks
 * Generates HTML Element: `<fast-virtual-list>`
 */
export const fastVirtualList = VirtualList.compose({
    baseName: "virtual-list",
    baseClass: VirtualList,
    template: virtualListTemplate,
    styles: virtualListStyles,
});

/**
 * Base class for VirtualList
 * @public
 */
export { VirtualList };

/**
 * A function that returns a {@link @microsoft/fast-foundation#VirtualListItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#virtualListItemTemplate}
 *
 *
 * @beta
 * @remarks
 * Generates HTML Element: `<fast-virtual-list-item>`
 */
export const fastVirtualListItem = VirtualListItem.compose({
    baseName: "virtual-list-item",
    baseClass: VirtualListItem,
    template: virtualListItemTemplate,
    styles: virtualListItemStyles,
});

/**
 * Base class for VirtualList
 * @public
 */
export { VirtualListItem };

export { virtualListStyles, virtualListItemStyles };
