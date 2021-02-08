---
id: data-grid
title: fast-data-grid
sidebar_label: data-grid
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/data-grid/README.md
---
## fast-data-grid

The `fast-data-grid` component is used to display tabular data.  The `fast-data-grid-row` and `fast-data-grid-cell` components are typically created programmatically by the parent grid but some authors may find it useful to create them manually.

### Usage

```html live
function ShowGrid(props) {
  useEffect(() => {
    const testGrid = document.getElementById("testgrid");
    testGrid.rowsData = [
        { item1: "value 1-1", item2: "value 2-1" },
        { item1: "value 1-2", item2: "value 2-2" },
        { item1: "value 1-3", item2: "value 2-3" },
    ]
  });

  return (
      <fast-data-grid id="testgrid"></fast-data-grid>
  );
}

```
---

## fast-data-grid-row

### Usage

```html live
function ShowRow(props) {
  useEffect(() => {
    const testRow = document.getElementById("testrow");
    testRow.columnDefinitions = [
        { columnDataKey: "item1" },
        { columnDataKey: "item2" },
    ];
    testRow.rowData = { item1: "value 1-1", item2: "value 2-1"};
  });

  return (
      <fast-data-grid-row id="testrow"></fast-data-grid-row>
  );
}
```
---

## fast-data-grid-cell

### Usage

```html live
function ShowCell(props) {
  useEffect(() => {
      const testCell = document.getElementById("testcell");
      testCell.rowData = { item1: "value 1-1", item2: "value 2-1" };
      testCell.columnDefinition = { columnDataKey: "item1" };
  });

  return (
      <fast-data-grid-cell id="testcell"></fast-data-grid-cell>
  );
}
```

### Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import {
    DataGrid,
    createDataGridTemplate,
    DataGridRow,
    createDataGridRowTemplate,
    DataGridCell,
    createDataGridCellTemplate,
} from "@microsoft/fast-foundation";
import { DataGridCellStyles as styles } from "./data-grid-cell.styles";
import { DataGridRowStyles as styles } from "./data-grid-row.styles";
import { DataGridStyles as styles } from "./data-grid.styles";

@customElement({
    name: "fast-data-grid",
    template: createDataGridTemplate("fast");,
    styles,
})
export class FASTDataGrid extends DataGrid {}

@customElement({
    name: "fast-data-grid-row",
    template: createDataGridRowTemplate("fast");,
    styles,
})
export class FASTDataGridRow extends DataGridRow {}

@customElement({
    name: "fast-data-grid-cell",
    template: createDataGridCellTemplate("fast"),
    styles,
})
export class FASTDataGridCell extends DataGridCell {}
```
