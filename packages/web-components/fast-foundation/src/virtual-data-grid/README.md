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



### class: `VirtualDataGrid`

#### Superclass

| Name               | Module                                     | Package |
| ------------------ | ------------------------------------------ | ------- |
| `_VirtualDataGrid` | src/virtual-data-grid/virtual-data-grid.ts |         |

#### Mixins

| Name           | Module                     | Package |
| -------------- | -------------------------- | ------- |
| `Virtualizing` | /src/virtual-list/index.js |         |

#### Static Fields

| Name              | Privacy | Type | Default | Description                                                      | Inherited From |
| ----------------- | ------- | ---- | ------- | ---------------------------------------------------------------- | -------------- |
| `generateColumns` | public  |      |         | generates a basic column definition by examining sample row data | FASTDataGrid   |

#### Fields

| Name                     | Privacy   | Type                        | Default | Description                                                                                                                                                                                                                                             | Inherited From |
| ------------------------ | --------- | --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `noTabbing`              | public    | `boolean`                   | `false` | When true the component will not add itself to the tab queue. Default is false.                                                                                                                                                                         | FASTDataGrid   |
| `generateHeader`         | public    | `GenerateHeaderOptions`     |         | Whether the grid should automatically generate a header row and its type                                                                                                                                                                                | FASTDataGrid   |
| `gridTemplateColumns`    | public    | `string`                    |         | String that gets applied to the the css gridTemplateColumns attribute of child rows                                                                                                                                                                     | FASTDataGrid   |
| `rowsData`               | public    | `object[]`                  | `[]`    | The data being displayed in the grid                                                                                                                                                                                                                    | FASTDataGrid   |
| `columnDefinitions`      | public    | `ColumnDefinition[]`        |         | The column definitions of the grid                                                                                                                                                                                                                      | FASTDataGrid   |
| `rowItemTemplate`        | public    | `ViewTemplate`              |         | The template to use for the programmatic generation of rows                                                                                                                                                                                             | FASTDataGrid   |
| `cellItemTemplate`       | public    | `ViewTemplate or undefined` |         | The template used to render cells in generated cells.                                                                                                                                                                                                   | FASTDataGrid   |
| `headerCellItemTemplate` | public    | `ViewTemplate or undefined` |         | The template used to render header cells in generated rows.                                                                                                                                                                                             | FASTDataGrid   |
| `focusRowIndex`          | public    | `number`                    | `0`     | The index of the row that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified row.       | FASTDataGrid   |
| `focusColumnIndex`       | public    | `number`                    | `0`     | The index of the column that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified column. | FASTDataGrid   |
| `rowElementTag`          | public    | `string`                    |         | Set by the component templates.                                                                                                                                                                                                                         | FASTDataGrid   |
| `rowindexUpdateQueued`   | protected | `boolean`                   | `false` |                                                                                                                                                                                                                                                         | FASTDataGrid   |
| `columnDefinitionsStale` | protected | `boolean`                   | `true`  |                                                                                                                                                                                                                                                         | FASTDataGrid   |
| `recycle`                | public    | `boolean`                   | `false` | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear.                                                                      | FASTDataList   |
| `positioning`            | public    | `boolean`                   | `false` | Whether or not positioning (ie. indexing) is available for the items generated by the repeat directive                                                                                                                                                  | FASTDataList   |
| `orientation`            | public    | `Orientation`               |         | Whether the list is oriented vertically or horizontally. Default is vertical.                                                                                                                                                                           | FASTDataList   |
| `sourceItems`            | public    | `object[]`                  |         | The source data array.                                                                                                                                                                                                                                  | FASTDataList   |
| `itemTemplate`           | public    | `ViewTemplate`              |         | The ViewTemplate used in the items repeat loop                                                                                                                                                                                                          | FASTDataList   |
| `itemContentsTemplate`   | public    | `ViewTemplate`              |         | The ViewTemplate used to render list item contents                                                                                                                                                                                                      | FASTDataList   |
| `displayItems`           | public    | `object[] or null`          | `null`  | The items currently displayed                                                                                                                                                                                                                           | FASTDataList   |
| `itemsPlaceholder`       | protected | `Node`                      |         |                                                                                                                                                                                                                                                         | FASTDataList   |

#### Methods

| Name                          | Privacy   | Description                                                                                                                                         | Parameters | Return          | Inherited From |
| ----------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | -------------- |
| `noTabbingChanged`            | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `gridTemplateColumnsChanged`  | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `rowsDataChanged`             | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `sourceItemsChanged`          | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `columnDefinitionsChanged`    | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `rowItemTemplateChanged`      | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior                                                                                                                          |            | `void`          | FASTDataList   |
| `getGridTemplateColumns`      | protected |                                                                                                                                                     |            | `string`        | FASTDataGrid   |
| `updateRowIndexes`            | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `updateItemTemplate`          | protected | applies the correct item template. Once an author overrides the item template with a custom one the author must manage template changes themselves. |            | `void`          | FASTDataList   |
| `orientationChanged`          | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `itemContentsTemplateChanged` | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `displayItemsChanged`         | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `createPlaceholderElement`    | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `getRepeatOptions`            | protected |                                                                                                                                                     |            | `RepeatOptions` | FASTDataList   |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `no-tabbing`            | noTabbing           | FASTDataGrid   |
| `generate-header`       | generateHeader      | FASTDataGrid   |
| `grid-template-columns` | gridTemplateColumns | FASTDataGrid   |
| `recycle`               | recycle             | FASTDataList   |
| `positioning`           | positioning         | FASTDataList   |

<hr/>

### class: `FASTVirtualDataGrid`

#### Superclass

| Name              | Module                                     | Package |
| ----------------- | ------------------------------------------ | ------- |
| `VirtualDataGrid` | src/virtual-data-grid/virtual-data-grid.ts |         |

#### Static Fields

| Name              | Privacy | Type | Default | Description                                                      | Inherited From |
| ----------------- | ------- | ---- | ------- | ---------------------------------------------------------------- | -------------- |
| `generateColumns` | public  |      |         | generates a basic column definition by examining sample row data | FASTDataGrid   |

#### Fields

| Name                     | Privacy   | Type                        | Default | Description                                                                                                                                                                                                                                             | Inherited From |
| ------------------------ | --------- | --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `noTabbing`              | public    | `boolean`                   | `false` | When true the component will not add itself to the tab queue. Default is false.                                                                                                                                                                         | FASTDataGrid   |
| `generateHeader`         | public    | `GenerateHeaderOptions`     |         | Whether the grid should automatically generate a header row and its type                                                                                                                                                                                | FASTDataGrid   |
| `gridTemplateColumns`    | public    | `string`                    |         | String that gets applied to the the css gridTemplateColumns attribute of child rows                                                                                                                                                                     | FASTDataGrid   |
| `rowsData`               | public    | `object[]`                  | `[]`    | The data being displayed in the grid                                                                                                                                                                                                                    | FASTDataGrid   |
| `columnDefinitions`      | public    | `ColumnDefinition[]`        |         | The column definitions of the grid                                                                                                                                                                                                                      | FASTDataGrid   |
| `rowItemTemplate`        | public    | `ViewTemplate`              |         | The template to use for the programmatic generation of rows                                                                                                                                                                                             | FASTDataGrid   |
| `cellItemTemplate`       | public    | `ViewTemplate or undefined` |         | The template used to render cells in generated cells.                                                                                                                                                                                                   | FASTDataGrid   |
| `headerCellItemTemplate` | public    | `ViewTemplate or undefined` |         | The template used to render header cells in generated rows.                                                                                                                                                                                             | FASTDataGrid   |
| `focusRowIndex`          | public    | `number`                    | `0`     | The index of the row that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified row.       | FASTDataGrid   |
| `focusColumnIndex`       | public    | `number`                    | `0`     | The index of the column that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified column. | FASTDataGrid   |
| `rowElementTag`          | public    | `string`                    |         | Set by the component templates.                                                                                                                                                                                                                         | FASTDataGrid   |
| `rowindexUpdateQueued`   | protected | `boolean`                   | `false` |                                                                                                                                                                                                                                                         | FASTDataGrid   |
| `columnDefinitionsStale` | protected | `boolean`                   | `true`  |                                                                                                                                                                                                                                                         | FASTDataGrid   |
| `recycle`                | public    | `boolean`                   | `false` | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear.                                                                      | FASTDataList   |
| `positioning`            | public    | `boolean`                   | `false` | Whether or not positioning (ie. indexing) is available for the items generated by the repeat directive                                                                                                                                                  | FASTDataList   |
| `orientation`            | public    | `Orientation`               |         | Whether the list is oriented vertically or horizontally. Default is vertical.                                                                                                                                                                           | FASTDataList   |
| `sourceItems`            | public    | `object[]`                  |         | The source data array.                                                                                                                                                                                                                                  | FASTDataList   |
| `itemTemplate`           | public    | `ViewTemplate`              |         | The ViewTemplate used in the items repeat loop                                                                                                                                                                                                          | FASTDataList   |
| `itemContentsTemplate`   | public    | `ViewTemplate`              |         | The ViewTemplate used to render list item contents                                                                                                                                                                                                      | FASTDataList   |
| `displayItems`           | public    | `object[] or null`          | `null`  | The items currently displayed                                                                                                                                                                                                                           | FASTDataList   |
| `itemsPlaceholder`       | protected | `Node`                      |         |                                                                                                                                                                                                                                                         | FASTDataList   |

#### Methods

| Name                          | Privacy   | Description                                                                                                                                         | Parameters | Return          | Inherited From |
| ----------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- | -------------- |
| `noTabbingChanged`            | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `gridTemplateColumnsChanged`  | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `rowsDataChanged`             | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `sourceItemsChanged`          | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `columnDefinitionsChanged`    | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `rowItemTemplateChanged`      | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior                                                                                                                          |            | `void`          | FASTDataList   |
| `getGridTemplateColumns`      | protected |                                                                                                                                                     |            | `string`        | FASTDataGrid   |
| `updateRowIndexes`            | protected |                                                                                                                                                     |            | `void`          | FASTDataGrid   |
| `updateItemTemplate`          | protected | applies the correct item template. Once an author overrides the item template with a custom one the author must manage template changes themselves. |            | `void`          | FASTDataList   |
| `orientationChanged`          | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `itemContentsTemplateChanged` | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `displayItemsChanged`         | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `createPlaceholderElement`    | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `getRepeatOptions`            | protected |                                                                                                                                                     |            | `RepeatOptions` | FASTDataList   |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `no-tabbing`            | noTabbing           | FASTDataGrid   |
| `generate-header`       | generateHeader      | FASTDataGrid   |
| `grid-template-columns` | gridTemplateColumns | FASTDataGrid   |
| `recycle`               | recycle             | FASTDataList   |
| `positioning`           | positioning         | FASTDataList   |

<hr/>


