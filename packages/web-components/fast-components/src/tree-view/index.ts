import { customElement } from "@microsoft/fast-element";
import { TreeView, TreeViewTemplate as template } from "@microsoft/fast-foundation";
import { TreeViewStyles as styles } from "./tree-view.styles";

@customElement({
    name: "fast-tree-view",
    template,
    styles,
})
export class FASTTreeView extends TreeView {}
