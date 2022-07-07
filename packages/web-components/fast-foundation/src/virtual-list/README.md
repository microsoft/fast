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



### class: `VirtualList`

#### Superclass

| Name           | Module                           | Package |
| -------------- | -------------------------------- | ------- |
| `_VirtualList` | src/virtual-list/virtual-list.ts |         |

#### Mixins

| Name           | Module                            | Package |
| -------------- | --------------------------------- | ------- |
| `Virtualizing` | /src/virtual-list/virtualizing.js |         |

#### Fields

| Name                   | Privacy   | Type                     | Default       | Description                                                                                                                                                                        | Inherited From |
| ---------------------- | --------- | ------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `recycle`              | public    | `boolean`                | `false`       | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear. | FASTDataList   |
| `items`                | public    | `object[]`               |               | The array of items to be rendered.                                                                                                                                                 | FASTDataList   |
| `itemLoadMode`         | public    | `ItemLoadMode`           | `"immediate"` | Controls the idle load queue behavior.                                                                                                                                             | FASTDataList   |
| `itemTemplate`         | public    | `ViewTemplate`           |               | The ViewTemplate used in the items repeat loop                                                                                                                                     | FASTDataList   |
| `itemContentsTemplate` | public    | `ViewTemplate`           |               | The ViewTemplate used to render a list item contents                                                                                                                               | FASTDataList   |
| `idleLoadingSuspended` | public    | `boolean`                |               | Suspends idle loading                                                                                                                                                              | FASTDataList   |
| `idleCallbackTimeout`  | public    | `number`                 | `1000`        | Defines the idle callback timeout value. Defaults to 1000                                                                                                                          | FASTDataList   |
| `listItemContext`      | public    | `object`                 |               | Used to pass custom context objects to list items.                                                                                                                                 | FASTDataList   |
| `itemsRepeatBehavior`  | protected | `RepeatBehavior or null` | `null`        |                                                                                                                                                                                    | FASTDataList   |

#### Methods

| Name                          | Privacy   | Description                                 | Parameters | Return | Inherited From |
| ----------------------------- | --------- | ------------------------------------------- | ---------- | ------ | -------------- |
| `itemsChanged`                | protected |                                             |            | `void` | FASTDataList   |
| `idleLoadingSuspendedChanged` | protected |                                             |            | `void` | FASTDataList   |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior for render items |            | `void` | FASTDataList   |
| `clearRepeatBehavior`         | protected |                                             |            | `void` | FASTDataList   |

#### Attributes

| Name                    | Field                | Inherited From |
| ----------------------- | -------------------- | -------------- |
| `recycle`               | recycle              | FASTDataList   |
| `item-load-mode`        | itemLoadMode         | FASTDataList   |
| `idleLoadingSuspended`  | idleLoadingSuspended | FASTDataList   |
| `idle-callback-timeout` | idleCallbackTimeout  | FASTDataList   |

<hr/>

### class: `FASTVirtualList`

#### Superclass

| Name          | Module                           | Package |
| ------------- | -------------------------------- | ------- |
| `VirtualList` | src/virtual-list/virtual-list.ts |         |

#### Fields

| Name                   | Privacy   | Type                     | Default       | Description                                                                                                                                                                        | Inherited From |
| ---------------------- | --------- | ------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `recycle`              | public    | `boolean`                | `false`       | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear. | FASTDataList   |
| `items`                | public    | `object[]`               |               | The array of items to be rendered.                                                                                                                                                 | FASTDataList   |
| `itemLoadMode`         | public    | `ItemLoadMode`           | `"immediate"` | Controls the idle load queue behavior.                                                                                                                                             | FASTDataList   |
| `itemTemplate`         | public    | `ViewTemplate`           |               | The ViewTemplate used in the items repeat loop                                                                                                                                     | FASTDataList   |
| `itemContentsTemplate` | public    | `ViewTemplate`           |               | The ViewTemplate used to render a list item contents                                                                                                                               | FASTDataList   |
| `idleLoadingSuspended` | public    | `boolean`                |               | Suspends idle loading                                                                                                                                                              | FASTDataList   |
| `idleCallbackTimeout`  | public    | `number`                 | `1000`        | Defines the idle callback timeout value. Defaults to 1000                                                                                                                          | FASTDataList   |
| `listItemContext`      | public    | `object`                 |               | Used to pass custom context objects to list items.                                                                                                                                 | FASTDataList   |
| `itemsRepeatBehavior`  | protected | `RepeatBehavior or null` | `null`        |                                                                                                                                                                                    | FASTDataList   |

#### Methods

| Name                          | Privacy   | Description                                 | Parameters | Return | Inherited From |
| ----------------------------- | --------- | ------------------------------------------- | ---------- | ------ | -------------- |
| `itemsChanged`                | protected |                                             |            | `void` | FASTDataList   |
| `idleLoadingSuspendedChanged` | protected |                                             |            | `void` | FASTDataList   |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior for render items |            | `void` | FASTDataList   |
| `clearRepeatBehavior`         | protected |                                             |            | `void` | FASTDataList   |

#### Attributes

| Name                    | Field                | Inherited From |
| ----------------------- | -------------------- | -------------- |
| `recycle`               | recycle              | FASTDataList   |
| `item-load-mode`        | itemLoadMode         | FASTDataList   |
| `idleLoadingSuspended`  | idleLoadingSuspended | FASTDataList   |
| `idle-callback-timeout` | idleCallbackTimeout  | FASTDataList   |

<hr/>



### Functions

| Name           | Description                                               | Parameters    | Return |
| -------------- | --------------------------------------------------------- | ------------- | ------ |
| `Virtualizing` | Base function for providing Custom Element Virtualization | `BaseCtor: T` | `T`    |

<hr/>


