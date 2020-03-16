import { customElement } from "@microsoft/fast-element";
import { TreeView } from "./tree-view";
import { TreeViewTemplate as template } from "./tree-view.template";
import { TreeViewStyles as styles } from "./tree-view.styles";

@customElement({
    name: "fast-tree-view",
    template,
    styles,
})
export class FASTTreeView extends TreeView {}
export * from "./tree-view.template";
export * from "./tree-view.styles";
export * from "./tree-view";
