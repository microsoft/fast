import { VirtualList, virtualListTemplate } from "@microsoft/fast-foundation";
import { virtualListStyles as styles } from "./virtual-list.styles";

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
    styles,
});

/**
 * Styles for VirtualList
 * @public
 */
export const virtualListStyles = styles;

/**
 * Base class for VirtualList
 * @public
 */
export { VirtualList };
