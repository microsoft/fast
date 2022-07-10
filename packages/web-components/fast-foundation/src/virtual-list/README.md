---
id: virtual-list
title: virtual-list
sidebar_label: virtual-list
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/virtual-list/README.md
---

A component that uses a template to render an array of objects based on whether each element would be in or near the specified viewport. 

## Usage

```html live
    <fast-virtual-list>
    </fast-virtual-list>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { VirtualList, VirtualListTemplate as template } from "@microsoft/fast-foundation";
import { VirtualListStyles as styles } from "./virtual-list.styles";

@customElement({
    name: "fast-virtual-list",
    template,
    styles,
})
export class FASTVirtualList extends VirtualList{}
```

## API



### class: `FASTVirtualListItem`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                 | Privacy | Type | Default | Description          | Inherited From |
| -------------------- | ------- | ---- | ------- | -------------------- | -------------- |
| `handleIdleCallback` | public  |      |         | Handle idle callback |                |

<hr/>



### class: `VirtualList`

#### Superclass

| Name           | Module                           | Package |
| -------------- | -------------------------------- | ------- |
| `_VirtualList` | src/virtual-list/virtual-list.ts |         |

#### Mixins

| Name           | Module                            | Package |
| -------------- | --------------------------------- | ------- |
| `Virtualizing` | /src/virtual-list/virtualizing.js |         |

<hr/>

### class: `FASTVirtualList`

#### Superclass

| Name          | Module                           | Package |
| ------------- | -------------------------------- | ------- |
| `VirtualList` | src/virtual-list/virtual-list.ts |         |

#### Fields

| Name                   | Privacy   | Type                     | Default | Description                                                                                                                                                                        | Inherited From |
| ---------------------- | --------- | ------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `items`                | public    | `object[]`               |         | The source array of objects to be rendered                                                                                                                                         |                |
| `recycle`              | public    | `boolean`                | `false` | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear. |                |
| `itemTemplate`         | public    | `ViewTemplate`           |         | The ViewTemplate used in the items repeat loop                                                                                                                                     |                |
| `itemContentsTemplate` | public    | `ViewTemplate`           |         | The ViewTemplate used to render list item contents                                                                                                                                 |                |
| `itemsRepeatBehavior`  | protected | `RepeatBehavior or null` | `null`  |                                                                                                                                                                                    |                |
| `itemsPlaceholder`     | protected | `Node`                   |         |                                                                                                                                                                                    |                |

#### Methods

| Name                          | Privacy   | Description                                 | Parameters | Return | Inherited From |
| ----------------------------- | --------- | ------------------------------------------- | ---------- | ------ | -------------- |
| `itemContentsTemplateChanged` | protected |                                             |            | `void` |                |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior for render items |            | `void` |                |
| `clearRepeatBehavior`         | protected |                                             |            | `void` |                |

#### Attributes

| Name      | Field   | Inherited From |
| --------- | ------- | -------------- |
| `recycle` | recycle |                |

<hr/>



### Functions

| Name           | Description                                               | Parameters    | Return |
| -------------- | --------------------------------------------------------- | ------------- | ------ |
| `Virtualizing` | Base function for providing Custom Element Virtualization | `BaseCtor: T` | `T`    |

<hr/>


