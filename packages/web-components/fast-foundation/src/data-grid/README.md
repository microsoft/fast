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
    <div>
        <script>
            (function () {
                document.getElementById("samplegrid").rowsData = [
                    { item1: "value 1-1", item2: "value 2-1" },
                    { item1: "value 1-2", item2: "value 2-2" },
                    { item1: "value 1-3", item2: "value 2-3" },
                ];
            })();
        </script>
        <fast-data-grid id="samplegrid"></fast-data-grid>
    </div>
```

### Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { DataGrid, DataGridTemplate as template } from "@microsoft/fast-foundation";
import { DataGridStyles as styles } from "./data-grid.styles";

@customElement({
    name: "fast-data-grid",
    template,
    styles,
})
export class FASTDataGrid extends DataGrid {}
```
---

## fast-data-grid-row

### Usage

```html live
    <div>
        <script>
            (function () {
                const rowElement = document.getElementById("samplegridrow")
                rowElement.rowsData = [
                    { item1: "value 1-1", item2: "value 2-1" },
                    { item1: "value 1-2", item2: "value 2-2" },
                    { item1: "value 1-3", item2: "value 2-3" },
                ];
                rowElement.columnDefinitions = [
                    { columnDataKey: "item1" },
                    { columnDataKey: "item2" },
                ];
            })();
        </script>
        <fast-data-grid-row id="samplegridrow"></fast-data-grid-row>
    </div>
```

### Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { DataGridRow, DataGridRowTemplate as template } from "@microsoft/fast-foundation";
import { DataGridRowStyles as styles } from "./data-grid-row.styles";

@customElement({
    name: "fast-data-grid-row",
    template,
    styles,
})
export class FASTDataGrid extends DataGridRow {}
```
---

## fast-data-grid-cell

### Usage

```html live
    <div>
        <script>
            (function () {
                const cellElement = document.getElementById("samplegridcell")
                cellElement.rowsData = [
                    { item1: "value 1-1", item2: "value 2-1" },
                    { item1: "value 1-2", item2: "value 2-2" },
                    { item1: "value 1-3", item2: "value 2-3" },
                ];
                cellElement.columnDefinition = { columnDataKey: "item1" };
            })();
        </script>
        <fast-data-grid-cell id="samplecell"></fast-data-grid-cell>
    </div>
```

### Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { DataGridCell, DataGridCellTemplate as template } from "@microsoft/fast-foundation";
import { DataGridCellStyles as styles } from "./data-grid-cell.styles";

@customElement({
    name: "fast-data-grid-row",
    template,
    styles,
})
export class FASTDataGrid extends DataGridRow {}
```
