---
id: data-grid
title: fast-data-grid
sidebar_label: data-grid
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/data-grid/README.md
description: fast-data-grid is a web component that enables authors to display an array of data in a tabular layout.
---

The `fast-data-grid` component is used to display tabular data.  The `fast-data-grid-row` and `fast-data-grid-cell` components are typically created programmatically by the parent grid but some authors may find it useful to create them manually.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastDataGridCell,
    fastDataGridRow,
    fastDataGrid
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastDataGridCell(),
        fastDataGridRow(),
        fastDataGrid()
    );
```

## Usage

```html 
<fast-data-grid id="samplegrid"></fast-data-grid>
```

Note that data must be provided to the grid by setting a property.

```ts
document.getElementById("samplegrid").rowsData = [
    { item1: "value 1-1", item2: "value 2-1" },
    { item1: "value 1-2", item2: "value 2-2" },
    { item1: "value 1-3", item2: "value 2-3" },
]; 
```

## Create your own design

### DataGridCell

```ts
import {
    dataGridCellTemplate,
    DataGridCell,
} from "@microsoft/fast-foundation";
import { dataGridCellStyles as cellStyles } from "./my-data-grid-cell.styles";

export const myDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate,
    styles: cellStyles,
});
```

### DataGridRow

```ts
import {
    dataGridRowTemplate,
    DataGridRow,
} from "@microsoft/fast-foundation";
import { dataGridRowStyles as rowStyles } from "./my-data-grid-row.styles";

export const myDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate,
    styles: rowStyles,
});
```

### DataGrid

```ts
import {
    dataGridTemplate,
    DataGrid,
} from "@microsoft/fast-foundation";
import { dataGridStyles as gridStyles } from "./my-data-grid.styles";

export const myDataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate,
    styles: gridStyles,
});
```

## API



### class: `FASTDataGridCell`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name               | Privacy | Type                       | Default | Description                                                                                               | Inherited From |
| ------------------ | ------- | -------------------------- | ------- | --------------------------------------------------------------------------------------------------------- | -------------- |
| `cellType`         | public  | `DataGridCellTypes`        |         | The type of cell                                                                                          |                |
| `gridColumn`       | public  | `string`                   |         | The column index of the cell. This will be applied to the css grid-column-index value applied to the cell |                |
| `rowData`          | public  | `object or null`           | `null`  | The base data for the parent row                                                                          |                |
| `columnDefinition` | public  | `ColumnDefinition or null` | `null`  | The base data for the column                                                                              |                |

#### Methods

| Name                      | Privacy   | Description | Parameters                                                               | Return | Inherited From |
| ------------------------- | --------- | ----------- | ------------------------------------------------------------------------ | ------ | -------------- |
| `gridColumnChanged`       | protected |             |                                                                          | `void` |                |
| `columnDefinitionChanged` | protected |             | `oldValue: ColumnDefinition or null, newValue: ColumnDefinition or null` | `void` |                |
| `handleFocusin`           | public    |             | `e: FocusEvent`                                                          | `void` |                |
| `handleFocusout`          | public    |             | `e: FocusEvent`                                                          | `void` |                |
| `handleKeydown`           | public    |             | `e: KeyboardEvent`                                                       | `void` |                |

#### Events

| Name           | Type | Description                                                                   | Inherited From |
| -------------- | ---- | ----------------------------------------------------------------------------- | -------------- |
| `cell-focused` |      | Fires a custom 'cell-focused' event when focus is on the cell or its contents |                |

#### Attributes

| Name          | Field      | Inherited From |
| ------------- | ---------- | -------------- |
| `cell-type`   | cellType   |                |
| `grid-column` | gridColumn |                |

#### Slots

| Name | Description                                                                     |
| ---- | ------------------------------------------------------------------------------- |
|      | The default slot for cell contents.  The "cell contents template" renders here. |

<hr/>



### class: `FASTDataGridRow`

#### Superclass

| Name           | Module                  | Package |
| -------------- | ----------------------- | ------- |
| `FASTDataList` | /src/data-list/index.js |         |

#### Fields

| Name                     | Privacy   | Type                        | Default | Description                                                                                                                                                                        | Inherited From |
| ------------------------ | --------- | --------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `orientation`            | public    | `Orientation`               |         | Whether the list is oriented vertically or horizontally. Default is vertical.                                                                                                      | FASTDataList   |
| `gridTemplateColumns`    | public    | `string`                    |         | String that gets applied to the the css gridTemplateColumns attribute for the row                                                                                                  |                |
| `rowType`                | public    | `DataGridRowTypes`          |         | The type of row                                                                                                                                                                    |                |
| `rowData`                | public    | `object or null`            | `null`  | The base data for this row                                                                                                                                                         |                |
| `columnDefinitions`      | public    | `ColumnDefinition[]`        |         | The column definitions of the row                                                                                                                                                  |                |
| `cellItemTemplate`       | public    | `ViewTemplate or undefined` |         | The template used to render cells in generated rows.                                                                                                                               |                |
| `headerCellItemTemplate` | public    | `ViewTemplate or undefined` |         | The template used to render header cells in generated rows.                                                                                                                        |                |
| `rowIndex`               | public    | `number`                    |         | The index of the row in the parent grid. This is typically set programmatically by the parent grid.                                                                                |                |
| `recycle`                | public    | `boolean`                   | `false` | Whether or not to recycle the html container used to display items. May help performance but containers may retain artifacts from previous use that developers will need to clear. | FASTDataList   |
| `positioning`            | public    | `boolean`                   | `false` | Whether or not positioning (ie. indexing) is available for the items generated by the repeat directive                                                                             | FASTDataList   |
| `sourceItems`            | public    | `object[]`                  |         | The source data array.                                                                                                                                                             | FASTDataList   |
| `itemTemplate`           | public    | `ViewTemplate`              |         | The ViewTemplate used in the items repeat loop                                                                                                                                     | FASTDataList   |
| `itemContentsTemplate`   | public    | `ViewTemplate`              |         | The ViewTemplate used to render list item contents                                                                                                                                 | FASTDataList   |
| `displayItems`           | public    | `object[] or null`          | `null`  | The items currently displayed                                                                                                                                                      | FASTDataList   |
| `itemsPlaceholder`       | protected | `Node`                      |         |                                                                                                                                                                                    | FASTDataList   |

#### Methods

| Name                          | Privacy   | Description                                                                                                                                         | Parameters         | Return          | Inherited From |
| ----------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------- | -------------- |
| `gridTemplateColumnsChanged`  | protected |                                                                                                                                                     |                    | `void`          |                |
| `rowDataChanged`              | protected |                                                                                                                                                     |                    | `void`          |                |
| `handleFocusout`              | public    |                                                                                                                                                     | `e: FocusEvent`    | `void`          |                |
| `handleCellFocus`             | public    |                                                                                                                                                     | `e: Event`         | `void`          |                |
| `handleKeydown`               | public    |                                                                                                                                                     | `e: KeyboardEvent` | `void`          |                |
| `updateItemTemplate`          | protected | applies the correct item template. Once an author overrides the item template with a custom one the author must manage template changes themselves. |                    | `void`          | FASTDataList   |
| `getRepeatOptions`            | protected |                                                                                                                                                     |                    | `RepeatOptions` | FASTDataList   |
| `orientationChanged`          | protected |                                                                                                                                                     |                    | `void`          | FASTDataList   |
| `sourceItemsChanged`          | protected |                                                                                                                                                     |                    | `void`          | FASTDataList   |
| `itemContentsTemplateChanged` | protected |                                                                                                                                                     |                    | `void`          | FASTDataList   |
| `displayItemsChanged`         | protected |                                                                                                                                                     |                    | `void`          | FASTDataList   |
| `createPlaceholderElement`    | protected |                                                                                                                                                     |                    | `void`          | FASTDataList   |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior                                                                                                                          |                    | `void`          | FASTDataList   |

#### Events

| Name          | Type | Description                                                                                                | Inherited From |
| ------------- | ---- | ---------------------------------------------------------------------------------------------------------- | -------------- |
| `row-focused` |      | Fires a custom 'row-focused' event when focus is on an element (usually a cell or its contents) in the row |                |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `grid-template-columns` | gridTemplateColumns |                |
| `row-type`              | rowType             |                |
| `recycle`               | recycle             | FASTDataList   |
| `positioning`           | positioning         | FASTDataList   |

#### Slots

| Name | Description                               |
| ---- | ----------------------------------------- |
|      | The default slot for custom cell elements |

<hr/>



### Variables

| Name                    | Description                                                                                             | Type                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `GenerateHeaderOptions` | Enumerates the data grid auto generated header options default option generates a non-sticky header row | `{ none: "none", default: "default", sticky: "sticky", }`                        |
| `DataGridCellTypes`     | Enumerates possible data grid cell types.                                                               | `{ default: "default", columnHeader: "columnheader", rowHeader: "rowheader", }`  |
| `DataGridRowTypes`      | Enumerates possible data grid row types                                                                 | `{ default: "default", header: "header", stickyHeader: "sticky-header", }`       |
| `DataGridCellTypeClass` | Class names for the data grid cell                                                                      | `{ columnheader: "column-header", default: "", rowheader: "row-header", }`       |
| `DataGridCellRole`      | Roles for the data grid cell                                                                            | `{ columnheader: "columnheader", rowheader: "rowheader", default: "gridcell", }` |

<hr/>



### class: `FASTDataGrid`

#### Superclass

| Name           | Module                  | Package |
| -------------- | ----------------------- | ------- |
| `FASTDataList` | /src/data-list/index.js |         |

#### Static Fields

| Name              | Privacy | Type | Default | Description                                                      | Inherited From |
| ----------------- | ------- | ---- | ------- | ---------------------------------------------------------------- | -------------- |
| `generateColumns` | public  |      |         | generates a basic column definition by examining sample row data |                |

#### Fields

| Name                     | Privacy   | Type                        | Default | Description                                                                                                                                                                                                                                             | Inherited From |
| ------------------------ | --------- | --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `noTabbing`              | public    | `boolean`                   | `false` | When true the component will not add itself to the tab queue. Default is false.                                                                                                                                                                         |                |
| `generateHeader`         | public    | `GenerateHeaderOptions`     |         | Whether the grid should automatically generate a header row and its type                                                                                                                                                                                |                |
| `gridTemplateColumns`    | public    | `string`                    |         | String that gets applied to the the css gridTemplateColumns attribute of child rows                                                                                                                                                                     |                |
| `rowsData`               | public    | `object[]`                  | `[]`    | The data being displayed in the grid                                                                                                                                                                                                                    |                |
| `columnDefinitions`      | public    | `ColumnDefinition[]`        |         | The column definitions of the grid                                                                                                                                                                                                                      |                |
| `rowItemTemplate`        | public    | `ViewTemplate`              |         | The template to use for the programmatic generation of rows                                                                                                                                                                                             |                |
| `cellItemTemplate`       | public    | `ViewTemplate or undefined` |         | The template used to render cells in generated cells.                                                                                                                                                                                                   |                |
| `headerCellItemTemplate` | public    | `ViewTemplate or undefined` |         | The template used to render header cells in generated rows.                                                                                                                                                                                             |                |
| `focusRowIndex`          | public    | `number`                    | `0`     | The index of the row that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified row.       |                |
| `focusColumnIndex`       | public    | `number`                    | `0`     | The index of the column that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified column. |                |
| `rowElementTag`          | public    | `string`                    |         | Set by the component templates.                                                                                                                                                                                                                         |                |
| `rowindexUpdateQueued`   | protected | `boolean`                   | `false` |                                                                                                                                                                                                                                                         |                |
| `columnDefinitionsStale` | protected | `boolean`                   | `true`  |                                                                                                                                                                                                                                                         |                |
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
| `noTabbingChanged`            | protected |                                                                                                                                                     |            | `void`          |                |
| `gridTemplateColumnsChanged`  | protected |                                                                                                                                                     |            | `void`          |                |
| `rowsDataChanged`             | protected |                                                                                                                                                     |            | `void`          |                |
| `sourceItemsChanged`          | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `columnDefinitionsChanged`    | protected |                                                                                                                                                     |            | `void`          |                |
| `rowItemTemplateChanged`      | protected |                                                                                                                                                     |            | `void`          |                |
| `initializeRepeatBehavior`    | protected | initialize repeat behavior                                                                                                                          |            | `void`          | FASTDataList   |
| `getGridTemplateColumns`      | protected |                                                                                                                                                     |            | `string`        |                |
| `updateRowIndexes`            | protected |                                                                                                                                                     |            | `void`          |                |
| `updateItemTemplate`          | protected | applies the correct item template. Once an author overrides the item template with a custom one the author must manage template changes themselves. |            | `void`          | FASTDataList   |
| `orientationChanged`          | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `itemContentsTemplateChanged` | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `displayItemsChanged`         | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `createPlaceholderElement`    | protected |                                                                                                                                                     |            | `void`          | FASTDataList   |
| `getRepeatOptions`            | protected |                                                                                                                                                     |            | `RepeatOptions` | FASTDataList   |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `no-tabbing`            | noTabbing           |                |
| `generate-header`       | generateHeader      |                |
| `grid-template-columns` | gridTemplateColumns |                |
| `recycle`               | recycle             | FASTDataList   |
| `positioning`           | positioning         | FASTDataList   |

#### Slots

| Name | Description                              |
| ---- | ---------------------------------------- |
|      | The default slot for custom row elements |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-data-grid)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#grid)
* [Open UI Analysis](https://open-ui.org/components/table.research)