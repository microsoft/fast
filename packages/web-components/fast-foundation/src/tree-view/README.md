---
id: tree-view
title: tree-view
sidebar_label: tree-view
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/tree-view/README.md
---

An implementation of a [tree](https://w3c.github.io/aria/#tree) as a web-component.
The `fast-tree-view` supports other elements being included in the tree structure with the introduction of `slot="item"`.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-tree-view>
        Root
        <fast-tree-item>
            Item 1
            <fast-divider slot="item"></fast-divider>
            <fast-tree-item>
                Sub-item 1
            </fast-tree-item>
        </fast-tree-item>
        <fast-tree-item>Item 2</fast-tree-item>
    </fast-tree-view>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { TreeView, TreeViewTemplate as template } from "@microsoft/fast-foundation";
import { TreeViewStyles as styles } from "./tree-view.styles";

@customElement({
    name: "fast-tree-view",
    template,
    styles,
})
export class FASTTreeView extends TreeView {}
```