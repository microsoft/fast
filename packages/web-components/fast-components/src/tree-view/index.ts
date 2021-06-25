import { treeViewTemplate as template, TreeView } from "@microsoft/fast-foundation";
import { treeViewStyles as styles } from "./tree-view.styles";

/**
 * A function that returns a {@link @microsoft/fast-foundation#TreeView} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeViewTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-tree-view\>
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
export const treeViewStyles = styles;

/**
 * Base class for TreeView
 * @public
 */
export { TreeView };
