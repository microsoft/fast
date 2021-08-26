import {
    treeItemTemplate as template,
    TreeItem,
    TreeItemOptions,
} from "@microsoft/fast-foundation";
import { treeItemStyles as styles } from "./tree-item.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#TreeItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-tree-item\>
 *
 */
export const fastTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: "tree-item",
    template,
    styles,
    expandCollapseGlyph: `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12.33a1 1 0 001.63.77l4.27-4.26a1.5 1.5 0 000-2.35L6.63 2.22A1 1 0 005 3v9.33z"/>
    </svg>
    `,
});

/**
 * Styles for TreeItem
 * @public
 */
export const treeItemStyles = styles;

/**
 * Base class for TreeItem
 * @public
 */
export { TreeItem };
