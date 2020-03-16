import { customElement } from "@microsoft/fast-element";
import { TreeItem } from "./tree-item";
import { TreeItemTemplate as template } from "./tree-item.template";
import { TreeItemStyles as styles } from "./tree-item.styles";

@customElement({
    name: "fast-tree-item",
    template,
    styles,
})
export class FASTTreeItem extends TreeItem {}
export * from "./tree-item.template";
export * from "./tree-item.styles";
export * from "./tree-item";
