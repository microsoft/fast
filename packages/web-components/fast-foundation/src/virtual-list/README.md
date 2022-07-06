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

| Name               | Module                  | Package |
| ------------------ | ----------------------- | ------- |
| `FASTDataListItem` | /src/data-list/index.js |         |

#### Fields

| Name                 | Privacy | Type | Default | Description          | Inherited From   |
| -------------------- | ------- | ---- | ------- | -------------------- | ---------------- |
| `handleIdleCallback` | public  |      |         | Handle idle callback | FASTDataListItem |

<hr/>



### class: `FASTVirtualList`

#### Superclass

| Name           | Module                  | Package |
| -------------- | ----------------------- | ------- |
| `FASTDataList` | /src/data-list/index.js |         |

#### Fields

| Name                    | Privacy   | Type                        | Default       | Description                                                                                                                                                                                               | Inherited From |
| ----------------------- | --------- | --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `virtualizationEnabled` | public    | `boolean`                   | `true`        | Whether or not the display should virtualize                                                                                                                                                              |                |
| `viewport`              | public    | `string`                    | `""`          | The HTML ID of the viewport element. If no viewport is set the default viewport is the element itself. Note that viewportElement can be set directly as well.                                             |                |
| `itemSize`              | public    | `number`                    |               | The size in pixels of each item along the virtualization axis. When auto-resizing this is the amount of space reserved for elements until they actually render and report size.  The default value is 50. |                |
| `viewportBuffer`        | public    | `number`                    |               | Defines an area in pixels on either end of the viewport where items outside the viewport will still be rendered.  The default value is 100.                                                               |                |
| `orientation`           | public    | `Orientation`               |               | Whether the list is oriented vertically or horizontally. Default is vertical.                                                                                                                             |                |
| `autoUpdateMode`        | public    | `VirtualListAutoUpdateMode` | `"viewport"`  | Auto update mode defines what prompts the component to check the dimensions of elements in the DOM and reset the visible items accordingly.  Calling update() always provokes an update.                  |                |
| `sizemap`               | public    | `SizeMap[]`                 |               | The sizemap for the items Authors need to provide a sizemap for arrays of irregular size items, when the items have a uniform size use the 'item-size' attribute instead.                                 |                |
| `autoResizeItems`       | public    | `boolean`                   |               | When true the virtual list component will track the size of child virtual-list-items and automatically update the size of the item in the size map.                                                       |                |
| `viewportElement`       | public    | `HTMLElement`               |               | The HTML element being used as the viewport                                                                                                                                                               |                |
| `getItemSizeMap`        | public    |                             |               | the position in the stack (in pixels) of the a particular item index in the base source data.  Note that this does not necessarily mean the item is currently being rendered.                             |                |
| `recycle`               | public    | `boolean`                   | `false`       | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear.                        | FASTDataList   |
| `items`                 | public    | `object[]`                  | `[]`          | The array of items to be rendered.                                                                                                                                                                        | FASTDataList   |
| `itemLoadMode`          | public    | `ItemLoadMode`              | `"immediate"` | Controls the idle load queue behavior.                                                                                                                                                                    | FASTDataList   |
| `itemTemplate`          | public    | `ViewTemplate`              |               | The ViewTemplate used in the items repeat loop                                                                                                                                                            | FASTDataList   |
| `itemContentsTemplate`  | public    | `ViewTemplate`              |               | The ViewTemplate used to render a list item contents                                                                                                                                                      | FASTDataList   |
| `idleLoadingSuspended`  | public    | `boolean`                   |               | Suspends idle loading                                                                                                                                                                                     | FASTDataList   |
| `idleCallbackTimeout`   | public    | `number`                    | `1000`        | Defines the idle callback timeout value. Defaults to 1000                                                                                                                                                 | FASTDataList   |
| `listItemContext`       | public    | `object`                    |               | Used to pass custom context objects to list items.                                                                                                                                                        | FASTDataList   |
| `itemsRepeatBehavior`   | protected | `RepeatBehavior or null`    | `null`        |                                                                                                                                                                                                           | FASTDataList   |

#### Methods

| Name                          | Privacy   | Description                                 | Parameters | Return | Inherited From |
| ----------------------------- | --------- | ------------------------------------------- | ---------- | ------ | -------------- |
| `itemsChanged`                | protected | override                                    |            | `void` | FASTDataList   |
| `update`                      | public    | Request a layout update                     |            | `void` |                |
| `requestPositionUpdates`      | protected | get position updates                        |            | `void` |                |
| `reset`                       | protected | request reset                               |            | `void` |                |
| `idleLoadingSuspendedChanged` | protected |                                             |            | `void` | FASTDataList   |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior for render items |            | `void` | FASTDataList   |
| `clearRepeatBehavior`         | protected |                                             |            | `void` | FASTDataList   |

#### Attributes

| Name                     | Field                 | Inherited From |
| ------------------------ | --------------------- | -------------- |
| `virtualization-enabled` | virtualizationEnabled |                |
| `viewport`               | viewport              |                |
| `item-size`              | itemSize              |                |
| `viewport-buffer`        | viewportBuffer        |                |
| `orientation`            | orientation           |                |
| `auto-update-mode`       | autoUpdateMode        |                |
| `auto-resize-items`      | autoResizeItems       |                |
| `recycle`                | recycle               | FASTDataList   |
| `item-load-mode`         | itemLoadMode          | FASTDataList   |
| `idleLoadingSuspended`   | idleLoadingSuspended  | FASTDataList   |
| `idle-callback-timeout`  | idleCallbackTimeout   | FASTDataList   |

<hr/>


