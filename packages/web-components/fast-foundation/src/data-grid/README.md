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

## `src/data-grid/data-grid-cell.ts`:

### class: `DataGridCell`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name               | Privacy | Type                                                              | Default  | Description                                                                                                                                                                         | Inherited From    |
| ------------------ | ------- | ----------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `cellType`         | public  | `DataGridCellTypes \| "default" \| "columnheader" \| "rowheader"` |          | The type of cell                                                                                                                                                                    |                   |
| `gridColumn`       | public  | `string`                                                          |          | The column index of the cell. This will be applied to the css grid-column-index value applied to the cell                                                                           |                   |
| `rowData`          | public  | `object \| null`                                                  | `null`   | The base data for the parent row                                                                                                                                                    |                   |
| `columnDefinition` | public  | `ColumnDefinition \| null`                                        | `null`   | The base data for the column                                                                                                                                                        |                   |
| `isActiveCell`     | private | `boolean`                                                         | `false`  |                                                                                                                                                                                     |                   |
| `customCellView`   | private | `HTMLView \| null`                                                | `null`   |                                                                                                                                                                                     |                   |
| `updateCellStyle`  | private |                                                                   |          |                                                                                                                                                                                     |                   |
| `_presentation`    | private | `ComponentPresentation \| null \| undefined`                      | `void 0` |                                                                                                                                                                                     | FoundationElement |
| `$presentation`    | public  | `ComponentPresentation \| null`                                   |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`         | public  | `ElementViewTemplate \| void \| null`                             |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`           | public  | `ElementStyles \| void \| null`                                   |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                      | Privacy   | Description | Parameters                                                               | Return | Inherited From    |
| ------------------------- | --------- | ----------- | ------------------------------------------------------------------------ | ------ | ----------------- |
| `cellTypeChanged`         | private   |             |                                                                          | `void` |                   |
| `gridColumnChanged`       | private   |             |                                                                          | `void` |                   |
| `columnDefinitionChanged` | private   |             | `oldValue: ColumnDefinition \| null, newValue: ColumnDefinition \| null` | `void` |                   |
| `handleFocusin`           | public    |             | `e: FocusEvent`                                                          | `void` |                   |
| `handleFocusout`          | public    |             | `e: FocusEvent`                                                          | `void` |                   |
| `handleKeydown`           | public    |             | `e: KeyboardEvent`                                                       | `void` |                   |
| `updateCellView`          | private   |             |                                                                          | `void` |                   |
| `disconnectCellView`      | private   |             |                                                                          | `void` |                   |
| `templateChanged`         | protected |             |                                                                          | `void` | FoundationElement |
| `stylesChanged`           | protected |             |                                                                          | `void` | FoundationElement |

#### Attributes

| Name          | Field      | Inherited From |
| ------------- | ---------- | -------------- |
| `cell-type`   | cellType   |                |
| `grid-column` | gridColumn |                |

<hr/>

### Exports

| Kind | Name                | Declaration       | Module                          | Package |
| ---- | ------------------- | ----------------- | ------------------------------- | ------- |
| `js` | `DataGridCellTypes` | DataGridCellTypes | src/data-grid/data-grid-cell.ts |         |
| `js` | `DataGridCell`      | DataGridCell      | src/data-grid/data-grid-cell.ts |         |

## `src/data-grid/data-grid-row.ts`:

### class: `DataGridRow`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                                          | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name                     | Privacy | Type                                                           | Default  | Description                                                                                                                                                                         | Inherited From    |
| ------------------------ | ------- | -------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `gridTemplateColumns`    | public  | `string`                                                       |          | String that gets applied to the the css gridTemplateColumns attribute for the row                                                                                                   |                   |
| `rowType`                | public  | `DataGridRowTypes \| "default" \| "header" \| "sticky-header"` |          | The type of row                                                                                                                                                                     |                   |
| `rowData`                | public  | `object \| null`                                               | `null`   | The base data for this row                                                                                                                                                          |                   |
| `columnDefinitions`      | public  | `ColumnDefinition[] \| null`                                   | `null`   | The column definitions of the row                                                                                                                                                   |                   |
| `cellItemTemplate`       | public  | `ViewTemplate \| undefined`                                    |          | The template used to render cells in generated rows.                                                                                                                                |                   |
| `headerCellItemTemplate` | public  | `ViewTemplate \| undefined`                                    |          | The template used to render header cells in generated rows.                                                                                                                         |                   |
| `rowIndex`               | public  | `number`                                                       |          | The index of the row in the parent grid. This is typically set programmatically by the parent grid.                                                                                 |                   |
| `cellsRepeatBehavior`    | private | `RepeatBehavior \| null`                                       | `null`   |                                                                                                                                                                                     |                   |
| `cellsPlaceholder`       | private | `Node \| null`                                                 | `null`   |                                                                                                                                                                                     |                   |
| `refocusOnLoad`          | private | `boolean`                                                      | `false`  |                                                                                                                                                                                     |                   |
| `updateRowStyle`         | private |                                                                |          |                                                                                                                                                                                     |                   |
| `_presentation`          | private | `ComponentPresentation \| null \| undefined`                   | `void 0` |                                                                                                                                                                                     | FoundationElement |
| `$presentation`          | public  | `ComponentPresentation \| null`                                |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                             | FoundationElement |
| `template`               | public  | `ElementViewTemplate \| void \| null`                          |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.          | FoundationElement |
| `styles`                 | public  | `ElementStyles \| void \| null`                                |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                            | Privacy   | Description | Parameters         | Return | Inherited From    |
| ------------------------------- | --------- | ----------- | ------------------ | ------ | ----------------- |
| `gridTemplateColumnsChanged`    | private   |             |                    | `void` |                   |
| `rowTypeChanged`                | private   |             |                    | `void` |                   |
| `rowDataChanged`                | private   |             |                    | `void` |                   |
| `cellItemTemplateChanged`       | private   |             |                    | `void` |                   |
| `headerCellItemTemplateChanged` | private   |             |                    | `void` |                   |
| `handleFocusout`                | public    |             | `e: FocusEvent`    | `void` |                   |
| `handleCellFocus`               | public    |             | `e: Event`         | `void` |                   |
| `handleKeydown`                 | public    |             | `e: KeyboardEvent` | `void` |                   |
| `updateItemTemplate`            | private   |             |                    | `void` |                   |
| `templateChanged`               | protected |             |                    | `void` | FoundationElement |
| `stylesChanged`                 | protected |             |                    | `void` | FoundationElement |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `grid-template-columns` | gridTemplateColumns |                |
| `row-type`              | rowType             |                |

<hr/>

### Exports

| Kind | Name          | Declaration | Module                          | Package |
| ---- | ------------- | ----------- | ------------------------------- | ------- |
| `js` | `DataGridRow` | DataGridRow | src/data-grid/data-grid-row\.ts |         |

## `src/data-grid/data-grid.ts`:

### class: `DataGrid`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Fields

| Name              | Privacy | Type | Default | Description                                                      | Inherited From |
| ----------------- | ------- | ---- | ------- | ---------------------------------------------------------------- | -------------- |
| `generateColumns` | public  |      |         | generates a basic column definition by examining sample row data |                |

#### Static Methods

| Name                      | Privacy | Description                                                                     | Parameters                              | Return                                                                                                                          | Inherited From    |
| ------------------------- | ------- | ------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `generateTemplateColumns` | private | generates a gridTemplateColumns based on columndata array                       | `columnDefinitions: ColumnDefinition[]` | `string`                                                                                                                        |                   |
| `compose`                 | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T`         | `(         overrideDefinition?: OverrideFoundationElementDefinition&lt;T&gt;     ) =&gt; FoundationElementRegistry&lt;T, K&gt;` | FoundationElement |

#### Fields

| Name                           | Privacy | Type                                                       | Default  | Description                                                                                                                                                                                                                                             | Inherited From    |
| ------------------------------ | ------- | ---------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `noTabbing`                    | public  | `boolean`                                                  | `false`  | When true the component will not add itself to the tab queue. Default is false.                                                                                                                                                                         |                   |
| `generateHeader`               | public  | `GenerateHeaderOptions \| "none" \| "default" \| "sticky"` |          | Whether the grid should automatically generate a header row and its type                                                                                                                                                                                |                   |
| `gridTemplateColumns`          | public  | `string`                                                   |          | String that gets applied to the the css gridTemplateColumns attribute of child rows                                                                                                                                                                     |                   |
| `rowsData`                     | public  | `object[]`                                                 | `[]`     | The data being displayed in the grid                                                                                                                                                                                                                    |                   |
| `columnDefinitions`            | public  | `ColumnDefinition[] \| null`                               | `null`   | The column definitions of the grid                                                                                                                                                                                                                      |                   |
| `rowItemTemplate`              | public  | `ViewTemplate`                                             |          | The template to use for the programmatic generation of rows                                                                                                                                                                                             |                   |
| `cellItemTemplate`             | public  | `ViewTemplate \| undefined`                                |          | The template used to render cells in generated rows.                                                                                                                                                                                                    |                   |
| `headerCellItemTemplate`       | public  | `ViewTemplate \| undefined`                                |          | The template used to render header cells in generated rows.                                                                                                                                                                                             |                   |
| `focusRowIndex`                | public  | `number`                                                   | `0`      | The index of the row that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified row.       |                   |
| `focusColumnIndex`             | public  | `number`                                                   | `0`      | The index of the column that will receive focus the next time the grid is focused. This value changes as focus moves to different rows within the grid.  Changing this value when focus is already within the grid moves focus to the specified column. |                   |
| `rowElementTag`                | public  | `string`                                                   |          | Set by the component templates.                                                                                                                                                                                                                         |                   |
| `rowsRepeatBehavior`           | private | `RepeatBehavior \| null`                                   |          |                                                                                                                                                                                                                                                         |                   |
| `rowsPlaceholder`              | private | `Node \| null`                                             | `null`   |                                                                                                                                                                                                                                                         |                   |
| `generatedHeader`              | private | `DataGridRow \| null`                                      | `null`   |                                                                                                                                                                                                                                                         |                   |
| `isUpdatingFocus`              | private | `boolean`                                                  | `false`  |                                                                                                                                                                                                                                                         |                   |
| `pendingFocusUpdate`           | private | `boolean`                                                  | `false`  |                                                                                                                                                                                                                                                         |                   |
| `observer`                     | private | `MutationObserver`                                         |          |                                                                                                                                                                                                                                                         |                   |
| `rowindexUpdateQueued`         | private | `boolean`                                                  | `false`  |                                                                                                                                                                                                                                                         |                   |
| `columnDefinitionsStale`       | private | `boolean`                                                  | `true`   |                                                                                                                                                                                                                                                         |                   |
| `generatedGridTemplateColumns` | private | `string`                                                   | `""`     |                                                                                                                                                                                                                                                         |                   |
| `focusOnCell`                  | private |                                                            |          |                                                                                                                                                                                                                                                         |                   |
| `onChildListChange`            | private |                                                            |          |                                                                                                                                                                                                                                                         |                   |
| `queueRowIndexUpdate`          | private |                                                            |          |                                                                                                                                                                                                                                                         |                   |
| `updateRowIndexes`             | private |                                                            |          |                                                                                                                                                                                                                                                         |                   |
| `_presentation`                | private | `ComponentPresentation \| null \| undefined`               | `void 0` |                                                                                                                                                                                                                                                         | FoundationElement |
| `$presentation`                | public  | `ComponentPresentation \| null`                            |          | A property which resolves the ComponentPresentation instance for the current component.                                                                                                                                                                 | FoundationElement |
| `template`                     | public  | `ElementViewTemplate \| void \| null`                      |          | Sets the template of the element instance. When undefined, the element will attempt to resolve the template from the associated presentation or custom element definition.                                                                              | FoundationElement |
| `styles`                       | public  | `ElementStyles \| void \| null`                            |          | Sets the default styles for the element instance. When undefined, the element will attempt to resolve default styles from the associated presentation or custom element definition.                                                                     | FoundationElement |

#### Methods

| Name                            | Privacy   | Description | Parameters | Return | Inherited From    |
| ------------------------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `noTabbingChanged`              | private   |             |            | `void` |                   |
| `generateHeaderChanged`         | private   |             |            | `void` |                   |
| `gridTemplateColumnsChanged`    | private   |             |            | `void` |                   |
| `rowsDataChanged`               | private   |             |            | `void` |                   |
| `columnDefinitionsChanged`      | private   |             |            | `void` |                   |
| `headerCellItemTemplateChanged` | private   |             |            | `void` |                   |
| `focusRowIndexChanged`          | private   |             |            | `void` |                   |
| `focusColumnIndexChanged`       | private   |             |            | `void` |                   |
| `queueFocusUpdate`              | private   |             |            | `void` |                   |
| `updateFocus`                   | private   |             |            | `void` |                   |
| `toggleGeneratedHeader`         | private   |             |            | `void` |                   |
| `templateChanged`               | protected |             |            | `void` | FoundationElement |
| `stylesChanged`                 | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name                    | Field               | Inherited From |
| ----------------------- | ------------------- | -------------- |
| `no-tabbing`            | noTabbing           |                |
| `generate-header`       | generateHeader      |                |
| `grid-template-columns` | gridTemplateColumns |                |

<hr/>

### Exports

| Kind | Name                    | Declaration           | Module                     | Package |
| ---- | ----------------------- | --------------------- | -------------------------- | ------- |
| `js` | `DataGridRowTypes`      | DataGridRowTypes      | src/data-grid/data-grid.ts |         |
| `js` | `GenerateHeaderOptions` | GenerateHeaderOptions | src/data-grid/data-grid.ts |         |
| `js` | `DataGrid`              | DataGrid              | src/data-grid/data-grid.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-data-grid)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/data-grid/data-grid.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#grid)
* [Open UI Analysis](https://open-ui.org/components/table.research)