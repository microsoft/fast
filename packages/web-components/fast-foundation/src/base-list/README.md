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



### class: `FASTBaseListItem`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

<hr/>



### class: `FASTBaseList`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name                       | Privacy | Type               | Default  | Description                                                                                                                                                                                                                                                                                                                           | Inherited From |
| -------------------------- | ------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `recycle`                  | public  | `boolean`          | `false`  | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear.                                                                                                                                                    |                |
| `idleLoadMode`             | public  | `ListIdleLoadMode` | `"auto"` | Controls the idle load queue behavior.                                                                                                                                                                                                                                                                                                |                |
| `items`                    | public  | `object[]`         | `[]`     | The array of items to be displayed.                                                                                                                                                                                                                                                                                                   |                |
| `itemTemplate`             | public  | `ViewTemplate`     |          | The ViewTemplate used in the items repeat loop                                                                                                                                                                                                                                                                                        |                |
| `listItemContentsTemplate` | public  | `ViewTemplate`     |          | The ViewTemplate used to render a list item contents                                                                                                                                                                                                                                                                                  |                |
| `listItemLoadMode`         | public  | `ListItemLoadMode` |          | Determines when child virtual list items load content, or more specifically when the item's "loadContent" observable prop becomes 'true'.  "immediate": When the component connects. "manual": When set manually by some external code (ie. 'myListItem.laodContent = true') "idle": Items are loaded based on available idle cycles. |                |
| `idleCallbackTimeout`      | public  | `number`           | `1000`   | Defines the idle callback timeout value. Defaults to 1000                                                                                                                                                                                                                                                                             |                |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `recycle`               | recycle             |                |
| `idle-load-mode`        | idleLoadMode        |                |
| `list-item-load-mode`   | listItemLoadMode    |                |
| `idle-callback-timeout` | idleCallbackTimeout |                |

<hr/>


