import {
    treeItemTemplate as template,
    TreeItem,
    TreeItemOptions,
} from "@microsoft/fast-foundation";
import { treeItemStyles as styles } from "./tree-item.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#TreeItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-tree-item>`
 *
 */
export const fastTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: "tree-item",
    template,
    styles,
    expandCollapseGlyph: /* html */ `
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5.7 3.28A1 1 0 0 0 4 4v4.02a1 1 0 0 0 1.7.7l2.04-2a1 1 0 0 0 0-1.42l-2.04-2Z"
            />
        </svg>
    `,
});

/**
 * Base class for TreeItem
 * @public
 */
export { TreeItem };

export { styles as treeItemStyles };
