---
id: tree-item
title: tree-item
sidebar_label: tree-item
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/tree-item/README.md
---

An implementation of a [tree-item](https://w3c.github.io/aria/#treeitem) as a web-component to be placed inside a `fast-tree-view`.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-tree-view>
        Root
        <fast-tree-item>Item 1</fast-tree-item>
        <fast-tree-item>Item 2</fast-tree-item>
    </fast-tree-view>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TreeItem, TreeItemTemplate as template } from "@microsoft/fast-foundation";
import { TreeItemStyles as styles } from "./tree-view.styles";

@customElement({
    name: "fast-tree-item",
    template,
    styles,
})
export class FASTTreeItem extends TreeItem {}
```