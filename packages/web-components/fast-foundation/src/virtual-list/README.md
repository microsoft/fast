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



### class: `VirtualListController`

#### Fields

| Name              | Privacy | Type          | Default | Description                                                                                                                                                               | Inherited From |
| ----------------- | ------- | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `sizemap`         | public  | `SizeMap[]`   |         | The sizemap for the items Authors need to provide a sizemap for arrays of irregular size items, when the items have a uniform size use the 'item-size' attribute instead. |                |
| `viewportElement` | public  | `HTMLElement` |         | The HTML element being used as the viewport                                                                                                                               |                |

#### Methods

| Name         | Privacy | Description | Parameters         | Return | Inherited From |
| ------------ | ------- | ----------- | ------------------ | ------ | -------------- |
| `connect`    | public  |             | `parent: DataList` |        |                |
| `disconnect` | public  |             |                    |        |                |

<hr/>



### class: `FASTVirtualListItem`

#### Superclass

| Name               | Module        | Package |
| ------------------ | ------------- | ------- |
| `FASTDataListItem` | /src/index.js |         |

<hr/>



### class: `FASTVirtualList`

#### Superclass

| Name           | Module        | Package |
| -------------- | ------------- | ------- |
| `FASTDataList` | /src/index.js |         |

#### Fields

| Name                       | Privacy | Type                    | Default                       | Description                                                                                                                                                                        | Inherited From |
| -------------------------- | ------- | ----------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `listController`           | public  | `VirtualListController` | `new VirtualListController()` |                                                                                                                                                                                    |                |
| `recycle`                  | public  | `boolean`               | `false`                       | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear. | FASTDataList   |
| `orientation`              | public  | `Orientation`           |                               | Whether the list is oriented vertically or horizontally. Default is vertical.                                                                                                      | FASTDataList   |
| `items`                    | public  | `object[]`              | `[]`                          | The array of objects to be displayed.                                                                                                                                              | FASTDataList   |
| `itemTemplate`             | public  | `ViewTemplate`          |                               | The ViewTemplate used in the items repeat loop                                                                                                                                     | FASTDataList   |
| `listItemContentsTemplate` | public  | `ViewTemplate`          |                               | The ViewTemplate used to render a list item contents                                                                                                                               | FASTDataList   |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `recycle`     | recycle     | FASTDataList   |
| `orientation` | orientation | FASTDataList   |

<hr/>


