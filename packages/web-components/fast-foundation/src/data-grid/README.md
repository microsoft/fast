---
id: data-grid
title: fast-data-grid
sidebar_label: data-grid
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/data-grid/README.md
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



### class: `DataGridCell`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name               | Privacy | Type                                                              | Default | Description | Inherited From    |
| ------------------ | ------- | ----------------------------------------------------------------- | ------- | ----------- | ----------------- |
| `cellType`         | public  | `DataGridCellTypes or "default" or "columnheader" or "rowheader"` |         |             |                   |
| `gridColumn`       | public  | `string`                                                          |         |             |                   |
| `rowData`          | public  | `object or null`                                                  |         |             |                   |
| `columnDefinition` | public  | `ColumnDefinition or null`                                        |         |             |                   |
| `$presentation`    | public  | `ComponentPresentation or null`                                   |         |             | FoundationElement |
| `template`         | public  | `ElementViewTemplate or void or null`                             |         |             | FoundationElement |
| `styles`           | public  | `ElementStyles or void or null`                                   |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters         | Return | Inherited From    |
| ----------------- | --------- | ----------- | ------------------ | ------ | ----------------- |
| `handleFocusin`   | public    |             | `e: FocusEvent`    | `void` |                   |
| `handleFocusout`  | public    |             | `e: FocusEvent`    | `void` |                   |
| `handleKeydown`   | public    |             | `e: KeyboardEvent` | `void` |                   |
| `templateChanged` | protected |             |                    | `void` | FoundationElement |
| `stylesChanged`   | protected |             |                    | `void` | FoundationElement |

#### Attributes

| Name          | Field      | Inherited From |
| ------------- | ---------- | -------------- |
| `cell-type`   | cellType   |                |
| `grid-column` | gridColumn |                |

<hr/>



### class: `DataGridRow`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Fields

| Name                     | Privacy | Type                                                           | Default | Description | Inherited From    |
| ------------------------ | ------- | -------------------------------------------------------------- | ------- | ----------- | ----------------- |
| `gridTemplateColumns`    | public  | `string`                                                       |         |             |                   |
| `rowType`                | public  | `DataGridRowTypes or "default" or "header" or "sticky-header"` |         |             |                   |
| `rowData`                | public  | `object or null`                                               |         |             |                   |
| `columnDefinitions`      | public  | `ColumnDefinition[] or null`                                   |         |             |                   |
| `cellItemTemplate`       | public  | `ViewTemplate or undefined`                                    |         |             |                   |
| `headerCellItemTemplate` | public  | `ViewTemplate or undefined`                                    |         |             |                   |
| `rowIndex`               | public  | `number`                                                       |         |             |                   |
| `$presentation`          | public  | `ComponentPresentation or null`                                |         |             | FoundationElement |
| `template`               | public  | `ElementViewTemplate or void or null`                          |         |             | FoundationElement |
| `styles`                 | public  | `ElementStyles or void or null`                                |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters         | Return | Inherited From    |
| ----------------- | --------- | ----------- | ------------------ | ------ | ----------------- |
| `handleFocusout`  | public    |             | `e: FocusEvent`    | `void` |                   |
| `handleCellFocus` | public    |             | `e: Event`         | `void` |                   |
| `handleKeydown`   | public    |             | `e: KeyboardEvent` | `void` |                   |
| `templateChanged` | protected |             |                    | `void` | FoundationElement |
| `stylesChanged`   | protected |             |                    | `void` | FoundationElement |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `grid-template-columns` | gridTemplateColumns |                |
| `row-type`              | rowType             |                |

<hr/>



### class: `DataGrid`

#### Superclass

| Name                | Module                                        | Package |
| ------------------- | --------------------------------------------- | ------- |
| `FoundationElement` | /src/foundation-element/foundation-element.js |         |

#### Static Fields

| Name              | Privacy | Type | Default | Description | Inherited From |
| ----------------- | ------- | ---- | ------- | ----------- | -------------- |
| `generateColumns` | public  |      |         |             |                |

#### Fields

| Name                     | Privacy | Type                                                       | Default | Description | Inherited From    |
| ------------------------ | ------- | ---------------------------------------------------------- | ------- | ----------- | ----------------- |
| `noTabbing`              | public  | `boolean`                                                  |         |             |                   |
| `generateHeader`         | public  | `GenerateHeaderOptions or "none" or "default" or "sticky"` |         |             |                   |
| `gridTemplateColumns`    | public  | `string`                                                   |         |             |                   |
| `rowsData`               | public  | `object[]`                                                 |         |             |                   |
| `columnDefinitions`      | public  | `ColumnDefinition[] or null`                               |         |             |                   |
| `rowItemTemplate`        | public  | `ViewTemplate`                                             |         |             |                   |
| `cellItemTemplate`       | public  | `ViewTemplate or undefined`                                |         |             |                   |
| `headerCellItemTemplate` | public  | `ViewTemplate or undefined`                                |         |             |                   |
| `focusRowIndex`          | public  | `number`                                                   |         |             |                   |
| `focusColumnIndex`       | public  | `number`                                                   |         |             |                   |
| `rowElementTag`          | public  | `string`                                                   |         |             |                   |
| `$presentation`          | public  | `ComponentPresentation or null`                            |         |             | FoundationElement |
| `template`               | public  | `ElementViewTemplate or void or null`                      |         |             | FoundationElement |
| `styles`                 | public  | `ElementStyles or void or null`                            |         |             | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `no-tabbing`            | noTabbing           |                |
| `generate-header`       | generateHeader      |                |
| `grid-template-columns` | gridTemplateColumns |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-data-grid)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#grid)
* [Open UI Analysis](https://open-ui.org/components/table.research)