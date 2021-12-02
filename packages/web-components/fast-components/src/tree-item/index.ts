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
 * Generates HTML Element: `<fast-tree-item>`
 *
 */
export const fastTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: "tree-item",
    template,
    styles,
    expandCollapseGlyph: `
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.5 8.95c0 .54.63.82 1.04.47l3.15-2.76c.4-.35.4-.97 0-1.32L5.54 2.58a.62.62 0 0 0-1.04.47v5.9Z"
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
