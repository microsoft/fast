import { customElement } from "@microsoft/fast-element";
import { TreeItem } from "@microsoft/fast-foundation";
import { TreeItemTemplate as template } from "@microsoft/fast-foundation";
import { TreeItemStyles as styles } from "./tree-item.styles";

@customElement({
    name: "fast-tree-item",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTTreeItem extends TreeItem {}
