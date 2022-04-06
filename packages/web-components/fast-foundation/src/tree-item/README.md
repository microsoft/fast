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



### class: `TreeItem`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name            | Privacy | Type                                  | Default | Description                                                                                                                                                                                 | Inherited From    |
| --------------- | ------- | ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `expanded`      | public  | `boolean`                             |         |                                                                                                                                                                                             |                   |
| `selected`      | public  | `boolean`                             |         |                                                                                                                                                                                             |                   |
| `disabled`      | public  | `boolean`                             |         | When true, the control will be immutable by user interaction. See [disabled HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) for more information. |                   |
| `isNestedItem`  | public  |                                       |         |                                                                                                                                                                                             |                   |
| `$presentation` | public  | `ComponentPresentation or null`       |         |                                                                                                                                                                                             | FoundationElement |
| `template`      | public  | `ElementViewTemplate or void or null` |         |                                                                                                                                                                                             | FoundationElement |
| `styles`        | public  | `ElementStyles or void or null`       |         |                                                                                                                                                                                             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name | Field    | Inherited From |
| ---- | -------- | -------------- |
|      | expanded |                |
|      | selected |                |
|      | disabled |                |

<hr/>

### Functions

| Name                | Description | Parameters    | Return              |
| ------------------- | ----------- | ------------- | ------------------- |
| `isTreeItemElement` |             | `el: Element` | `el is HTMLElement` |

<hr/>


