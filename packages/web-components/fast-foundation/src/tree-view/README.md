---
id: tree-view
title: fast-tree-view
sidebar_label: tree-view
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/tree-view/README.md
---

As defined by the [W3C](https://w3c.github.io/aria/#tree):

> A tree view widget presents a hierarchical list. Any item in the hierarchy may have child items, and items that have children may be expanded or collapsed to show or hide the children. For example, in a file system navigator that uses a tree view to display folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastTreeItem,
    fastTreeView
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTreeItem(),
        fastTreeView()
    );
```

### Customizing the Glyph

```ts
import {
    provideFASTDesignSystem,
    fastTreeItem,
    fastTreeView
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastTreeItem({
            expandCollapseGlyph: `...your expand/collapse glyph`
        }),
        fastTreeView()
    );
```

## Usage

```html live
<fast-tree-view>
    Root
    <fast-tree-item>
        Item 1
        <fast-tree-item>Sub-item 1</fast-tree-item>
        <fast-tree-item>Sub-item 2</fast-tree-item>
    </fast-tree-item>
    <fast-tree-item>Item 2</fast-tree-item>
</fast-tree-view>
```

## Create your own design

### TreeItem

```ts
import {
    treeItemTemplate as template,
    TreeItem,
    TreeItemOptions,
} from "@microsoft/fast-foundation";
import { treeItemStyles as styles } from "./my-tree-item.styles";

export const myTreeItem = TreeItem.compose<TreeItemOptions>({
    baseName: "tree-item",
    template,
    styles,
    expandCollapseGlyph: `...default expand/collapse glyph`,
});
```

### TreeView

```ts
import { treeViewTemplate as template, TreeView } from "@microsoft/fast-foundation";
import { treeViewStyles as styles } from "./tree-view.styles";

export const myTreeView = TreeView.compose({
    baseName: "tree-view",
    template,
    styles,
});
```

## API

### `src/tree-view/tree-view.template.ts`:

#### Functions

| Name               | Description                                                                 | Parameters            | Return |
| ------------------ | --------------------------------------------------------------------------- | --------------------- | ------ |
| `treeViewTemplate` | The template for the {@link @microsoft/fast-foundation#TreeView} component. | `context, definition` |        |

<hr/>

#### Exports

| Kind | Name               | Declaration      | Module                               | Package |
| ---- | ------------------ | ---------------- | ------------------------------------ | ------- |
| `js` | `treeViewTemplate` | treeViewTemplate | src/tree-view/tree-view\.template.ts |         |

### `src/tree-view/tree-view.ts`:

#### class: `TreeView`

##### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

##### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

##### Fields

| Name                   | Privacy | Type                                         | Default  | Description                                                                                                                                                                                           | Inherited From    |
| ---------------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `renderCollapsedNodes` | public  | `boolean`                                    |          | /\*\*&#xD;&#xA;   When true, the control will be appear expanded by user interaction.                                                                                                                 |                   |
| `currentSelected`      | public  | `HTMLElement \| TreeItem \| null`            |          | The currently selected tree item                                                                                                                                                                      |                   |
| `nested`               | private | `boolean`                                    |          |                                                                                                                                                                                                       |                   |
| `setItems`             | private |                                              |          | Updates the tree view when slottedTreeItems changes                                                                                                                                                   |                   |
| `isFocusableElement`   | private |                                              |          | check if the item is focusable                                                                                                                                                                        |                   |
| `isSelectedElement`    | private |                                              |          |                                                                                                                                                                                                       |                   |
| `_presentation`        | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                       | FoundationElement |
| `$presentation`        | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                      | FoundationElement |
| `template`             | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.          | FoundationElement |
| `styles`               | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition. | FoundationElement |

##### Methods

| Name                      | Privacy   | Description                                                          | Parameters                      | Return                            | Inherited From    |
| ------------------------- | --------- | -------------------------------------------------------------------- | ------------------------------- | --------------------------------- | ----------------- |
| `slottedTreeItemsChanged` | private   |                                                                      |                                 | `void`                            |                   |
| `focusNextNode`           | private   | Move focus to a tree item based on its offset from the provided item | `delta: number, item: TreeItem` | `void`                            |                   |
| `getValidFocusableItem`   | private   | checks if there are any nested tree items                            |                                 | `null \| HTMLElement \| TreeItem` |                   |
| `checkForNestedItems`     | private   | checks if there are any nested tree items                            |                                 | `boolean`                         |                   |
| `getVisibleNodes`         | private   |                                                                      |                                 | `HTMLElement[]`                   |                   |
| `templateChanged`         | protected |                                                                      |                                 | `void`                            | FoundationElement |
| `stylesChanged`           | protected |                                                                      |                                 | `void`                            | FoundationElement |

##### Attributes

| Name                     | Field                | Inherited From |
| ------------------------ | -------------------- | -------------- |
| `render-collapsed-nodes` | renderCollapsedNodes |                |

<hr/>

#### Exports

| Kind | Name       | Declaration | Module                      | Package |
| ---- | ---------- | ----------- | --------------------------- | ------- |
| `js` | `TreeView` | TreeView    | src/tree-view/tree-view\.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-tree-view)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/tree-view/tree-view.spec.md)
* [W3C Component Aria Practices](https://www.w3.org/TR/wai-aria/#tree)