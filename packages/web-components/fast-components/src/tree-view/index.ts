import { customElement } from "@microsoft/fast-element";
import { TreeView, TreeViewTemplate as template } from "@microsoft/fast-foundation";
import { TreeViewStyles as styles } from "./tree-view.styles";
export { TreeViewStyles } from "./tree-view.styles";

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
@customElement({
    name: "fast-tree-view",
    template,
    styles,
})
export class FASTTreeView extends TreeView {}
