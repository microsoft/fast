import { treeViewTemplate as template, TreeView } from "@microsoft/fast-foundation";
import { treeViewStyles as styles } from "./tree-view.styles";

/**
 * A function that returns a Tree View registration for configuring the component with a DesignSystem.
 * Implements Tree View
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-tree-view\>
 *
 */
export const /* @echo namespace */TreeView = TreeView.compose({
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
