import { TreeItemTemplate as template, TreeItem } from "@microsoft/fast-foundation";
import { TreeItemStyles as styles } from "./tree-item.styles";

/**
 * The FAST tree item Custom Element. Implements, {@link @microsoft/fast-foundation#TreeItem}
 * {@link @microsoft/fast-foundation#TreeItemTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-tree-item\>
 *
 */
export const fastTreeItem = TreeItem.compose({
    baseName: "tree-item",
    template,
    styles,
});

/**
 * Styles for TreeItem
 * @public
 */
export const TreeItemStyles = styles;
