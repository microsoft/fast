---
id: tree-item
title: tree-item
sidebar_label: tree-item
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/tree-item/README.md
---

An implementation of a [tree-item](https://w3c.github.io/aria/#treeitem) as a web-component to be placed inside a `fast-tree-view`.

## Usage

```html live
<fast-design-system-provider>
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

## API



### class: `FASTTreeItem`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name           | Privacy | Type      | Default | Description                                                                                                                                                                                 | Inherited From |
| -------------- | ------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `expanded`     | public  | `boolean` | `false` | When true, the control will be appear expanded by user interaction.                                                                                                                         |                |
| `selected`     | public  | `boolean` |         | When true, the control will appear selected by user interaction.                                                                                                                            |                |
| `disabled`     | public  | `boolean` |         | When true, the control will be immutable by user interaction. See [disabled HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) for more information. |                |
| `isNestedItem` | public  |           |         | Whether the tree is nested                                                                                                                                                                  |                |

#### Methods

| Name              | Privacy   | Description | Parameters                                   | Return | Inherited From |
| ----------------- | --------- | ----------- | -------------------------------------------- | ------ | -------------- |
| `expandedChanged` | protected |             |                                              | `void` |                |
| `selectedChanged` | protected |             |                                              | `void` |                |
| `itemsChanged`    | protected |             | `oldValue: unknown, newValue: HTMLElement[]` | `void` |                |

#### Events

| Name              | Type | Description                                                            | Inherited From |
| ----------------- | ---- | ---------------------------------------------------------------------- | -------------- |
| `expanded-change` |      | Fires a custom 'expanded-change' event when the expanded state changes |                |
| `selected-change` |      | Fires a custom 'selected-change' event when the selected state changes |                |

#### Attributes

| Name | Field    | Inherited From |
| ---- | -------- | -------------- |
|      | expanded |                |
|      | selected |                |
|      | disabled |                |

#### CSS Parts

| Name                     | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `positioning-region`     | The element used to position the tree item content with exception of any child nodes |
| `content-region`         | The element containing the expand/collapse, start, and end slots                     |
| `items`                  | The element wrapping any child items                                                 |
| `expand-collapse-button` | The expand/collapse button                                                           |

#### Slots

| Name                     | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `start`                  | Content which can be provided before the tree item content                  |
| `end`                    | Content which can be provided after the tree item content                   |
|                          | The default slot for tree item text content                                 |
| `item`                   | The slot for tree items (fast tree items manage this assignment themselves) |
| `expand-collapse-button` | The expand/collapse button                                                  |

<hr/>

### Functions

| Name                | Description                      | Parameters    | Return              |
| ------------------- | -------------------------------- | ------------- | ------------------- |
| `isTreeItemElement` | check if the item is a tree item | `el: Element` | `el is HTMLElement` |

<hr/>


