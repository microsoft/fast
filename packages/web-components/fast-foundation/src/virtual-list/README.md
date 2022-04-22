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



### class: `VirtualListItem`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Fields

| Name                | Privacy | Type                                  | Default | Description                                                                                                                                                                         | Inherited From    |
| ------------------- | ------- | ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `loadMode`          | public  | `VirtualListItemLoadMode`             |         |                                                                                                                                                                                     |                   |
| `itemData`          | public  | `object`                              |         | The data associated with this item                                                                                                                                                  |                   |
| `itemIndex`         | public  | `number`                              |         | The index of the item in the items array.                                                                                                                                           |                   |
| `listItemContext`   | public  | `VirtualListItemContext`              |         | Custom context provided to the parent virtual list                                                                                                                                  |                   |
| `idleCallbackQueue` | public  | `IdleCallbackQueue`                   |         | idleCallbackQueue instance                                                                                                                                                          |                   |
| `listItemTemplate`  | public  | `ViewTemplate`                        |         | The viewtemplate used to render the item                                                                                                                                            |                   |
| `$presentation`     | public  | `ComponentPresentation or null`       |         | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`          | public  | `ElementViewTemplate or void or null` |         | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`            | public  | `ElementStyles or void or null`       |         | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

<hr/>



### class: `VirtualList`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Fields

| Name                    | Privacy | Type                                  | Default    | Description                                                                                                                                                                                                                                                                                                                           | Inherited From    |
| ----------------------- | ------- | ------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `virtualizationEnabled` | public  | `boolean`                             | `true`     | Whether or not the display should virtualize                                                                                                                                                                                                                                                                                          |                   |
| `viewport`              | public  | `string`                              | `""`       | The HTML ID of the viewport element. If no viewport is set the default viewport is the element itself. Note that viewportElement can be set directly as well.                                                                                                                                                                         |                   |
| `itemSize`              | public  | `number`                              |            | The size in pixels of each item along the virtualization axis. When auto-resizing this is the amount of space reserved for elements until they actually render and report size.  The default value is 50.                                                                                                                             |                   |
| `viewportBuffer`        | public  | `number`                              |            | Defines an area in pixels on either end of the viewport where items outside the viewport will still be rendered.  The default value is 100.                                                                                                                                                                                           |                   |
| `orientation`           | public  | `Orientation`                         |            | Whether the list is oriented vertically or horizontally. Default is vertical.                                                                                                                                                                                                                                                         |                   |
| `autoUpdateMode`        | public  | `VirtualListAutoUpdateMode`           | `"manual"` | Auto update mode defines what prompts the component to check the dimensions of elements in the DOM and reset the visible items accordingly.  Calling update() always provokes an update.                                                                                                                                              |                   |
| `recycle`               | public  | `boolean`                             | `true`     | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear.                                                                                                                                                    |                   |
| `items`                 | public  | `object[]`                            | `[]`       | The array of items to be displayed.                                                                                                                                                                                                                                                                                                   |                   |
| `sizemap`               | public  | `SizeMap[]`                           |            | The sizemap for the items Authors need to provide a sizemap for arrays of irregular size items, when the items have a uniform size use the 'item-size' attribute instead.                                                                                                                                                             |                   |
| `autoResizeItems`       | public  | `boolean`                             |            | When true the virtual list component will track the size of child virtual-list-items and automatically update the size of the item in the size map.                                                                                                                                                                                   |                   |
| `viewportElement`       | public  | `HTMLElement`                         |            | The HTML element being used as the viewport                                                                                                                                                                                                                                                                                           |                   |
| `itemTemplate`          | public  | `ViewTemplate`                        |            | The ViewTemplate used in the items repeat loop                                                                                                                                                                                                                                                                                        |                   |
| `listItemTemplate`      | public  | `ViewTemplate`                        |            | The ViewTemplate used to render a virtual list item                                                                                                                                                                                                                                                                                   |                   |
| `listItemContext`       | public  | `object`                              |            | Used to pass custom context objects to list items.                                                                                                                                                                                                                                                                                    |                   |
| `listItemLoadMode`      | public  | `VirtualListItemLoadMode`             |            | Determines when child virtual list items load content, or more specifically when the item's "loadContent" observable prop becomes 'true'.  "immediate": When the component connects. "manual": When set manually by some external code (ie. 'myListItem.laodContent = true') "idle": Items are loaded based on available idle cycles. |                   |
| `idleCallbackTimeout`   | public  | `number`                              | `1000`     | Defines the idle callback timeout value. Defaults to 1000                                                                                                                                                                                                                                                                             |                   |
| `getItemSizeMap`        | public  |                                       |            | the position in the stack (in pixels) of the a particular item index in the base source data.  Note that this does not necessarily mean the item is currently being rendered.                                                                                                                                                         |                   |
| `$presentation`         | public  | `ComponentPresentation or null`       |            | A property which resolves the ComponentPresentation instance for the current component.                                                                                                                                                                                                                                               | FoundationElement |
| `template`              | public  | `ElementViewTemplate or void or null` |            | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                                                                                                                                                            | FoundationElement |
| `styles`                | public  | `ElementStyles or void or null`       |            | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.                                                                                                                                                   | FoundationElement |

#### Methods

| Name                         | Privacy   | Description             | Parameters | Return | Inherited From    |
| ---------------------------- | --------- | ----------------------- | ---------- | ------ | ----------------- |
| `update`                     | public    | Request a layout update |            | `void` |                   |
| `handleListItemConnected`    | public    |                         | `e: Event` | `void` |                   |
| `handleListItemDisconnected` | public    |                         | `e: Event` | `void` |                   |
| `requestPositionUpdates`     | protected | get position updates    |            | `void` |                   |
| `reset`                      | protected | request reset           |            | `void` |                   |
| `templateChanged`            | protected |                         |            | `void` | FoundationElement |
| `stylesChanged`              | protected |                         |            | `void` | FoundationElement |

#### Attributes

| Name                     | Field                 | Inherited From |
| ------------------------ | --------------------- | -------------- |
| `virtualization-enabled` | virtualizationEnabled |                |
| `viewport`               | viewport              |                |
| `item-size`              | itemSize              |                |
| `viewport-buffer`        | viewportBuffer        |                |
| `orientation`            | orientation           |                |
| `auto-update-mode`       | autoUpdateMode        |                |
| `recycle`                | recycle               |                |
| `auto-resize-items`      | autoResizeItems       |                |
| `list-item-load-mode`    | listItemLoadMode      |                |
| `idle-callback-timeout`  | idleCallbackTimeout   |                |

<hr/>


