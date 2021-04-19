import { TreeViewTemplate as template, TreeView } from "@microsoft/fast-foundation";
import { TreeViewStyles as styles } from "./tree-view.styles";

/**
 * The FAST tree view Custom Element. Implements, {@link @microsoft/fast-foundation#TreeView}
 * {@link @microsoft/fast-foundation#TreeViewTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-tree-view\>
 *
 */
export const fastTreeView = TreeView.compose({
    baseName: "tree-view",
    template,
    styles,
});

/**
 * Styles for TreeView
 * @public
 */
export const TreeViewStyles = styles;
