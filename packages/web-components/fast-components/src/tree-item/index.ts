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
    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 8.94915C4.5 9.4861 5.13245 9.7731 5.53655 9.4195L8.6919 6.6586C9.0903 6.30995 9.0903 5.6902 8.6919 5.34155L5.53655 2.58066C5.13245 2.22706 4.5 2.51405 4.5 3.05102V8.94915Z"/>
    </svg>
    `,
});

/**
 * Base class for TreeItem
 * @public
 */
export { TreeItem };

export { styles as treeItemStyles };
