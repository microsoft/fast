---
id: data-list
title: data-list
sidebar_label: data-list
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/data-list/README.md
---

A component that uses a template to render an array of objects based on whether each element would be in or near the specified viewport. 

## Usage

```html live
    <data-virtual-list>
    </data-virtual-list>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { DataList, DataListTemplate as template } from "@microsoft/fast-foundation";
import { DataListStyles as styles } from "./data-list.styles";

@customElement({
    name: "fast-data-list",
    template,
    styles,
})
export class FASTDataList extends DataList{}
```

## API



### class: `FASTDataListItem`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                 | Privacy | Type | Default | Description          | Inherited From |
| -------------------- | ------- | ---- | ------- | -------------------- | -------------- |
| `handleIdleCallback` | public  |      |         | Handle idle callback |                |

<hr/>



### class: `FASTDataList`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                   | Privacy   | Type                     | Default       | Description                                                                                                                                                                        | Inherited From |
| ---------------------- | --------- | ------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `recycle`              | public    | `boolean`                | `false`       | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear. |                |
| `items`                | public    | `object[]`               | `[]`          | The array of items to be rendered.                                                                                                                                                 |                |
| `itemLoadMode`         | public    | `ItemLoadMode`           | `"immediate"` | Controls the idle load queue behavior.                                                                                                                                             |                |
| `itemTemplate`         | public    | `ViewTemplate`           |               | The ViewTemplate used in the items repeat loop                                                                                                                                     |                |
| `itemContentsTemplate` | public    | `ViewTemplate`           |               | The ViewTemplate used to render a list item contents                                                                                                                               |                |
| `idleLoadingSuspended` | public    | `boolean`                |               | Suspends idle loading                                                                                                                                                              |                |
| `idleCallbackTimeout`  | public    | `number`                 | `1000`        | Defines the idle callback timeout value. Defaults to 1000                                                                                                                          |                |
| `listItemContext`      | public    | `object`                 |               | Used to pass custom context objects to list items.                                                                                                                                 |                |
| `itemsRepeatBehavior`  | protected | `RepeatBehavior or null` | `null`        |                                                                                                                                                                                    |                |

#### Methods

| Name                          | Privacy   | Description                                 | Parameters | Return | Inherited From |
| ----------------------------- | --------- | ------------------------------------------- | ---------- | ------ | -------------- |
| `itemsChanged`                | protected |                                             |            | `void` |                |
| `idleLoadingSuspendedChanged` | protected |                                             |            | `void` |                |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior for render items |            | `void` |                |
| `clearRepeatBehavior`         | protected |                                             |            | `void` |                |

#### Attributes

| Name                    | Field                | Inherited From |
| ----------------------- | -------------------- | -------------- |
| `recycle`               | recycle              |                |
| `item-load-mode`        | itemLoadMode         |                |
| `idleLoadingSuspended`  | idleLoadingSuspended |                |
| `idle-callback-timeout` | idleCallbackTimeout  |                |

<hr/>


