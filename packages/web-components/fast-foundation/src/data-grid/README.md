---
id: data-grid
title: fast-data-grid
sidebar_label: data-grid
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/data-grid/README.md
---
The `fast-data-grid` component is used to display tabular data.  The `fast-data-grid-row` and `fast-data-grid-cell` components are typically created programmatically by the parent grid but some authors may find it useful to create them manually.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-data-grid>
    </fast-data-grid>
</fast-design-system-provider>
```
---

## Applying custom styles

### fast-data-grid

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

### fast-data-grid-row

```ts
import { customElement } from "@microsoft/fast-element";
import { DataGridRow, DataGridRowTemplate as template } from "@microsoft/fast-foundation";
import { DataGridRowStyles as styles } from "./data-grid-row.styles";

@customElement({
    name: "fast-data-grid-row",
    template,
    styles,
})
export class FASTDataGridRow extends DataGridRow {}
```

### fast-data-grid-cell

```ts
import { customElement } from "@microsoft/fast-element";
import { DataGridCell, DataGridCellTemplate as template } from "@microsoft/fast-foundation";
import { DataGridCellStyles as styles } from "./data-grid-cell.styles";

@customElement({
    name: "fast-data-grid-cell",
    template,
    styles,
})
export class FASTDataGridCell extends DataGridCell {}
```
