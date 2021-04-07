import { customElement, ViewTemplate } from "@microsoft/fast-element";
import {
    createDataGridCellTemplate,
    createDataGridRowTemplate,
    createDataGridTemplate,
    DataGrid,
    DataGridCell,
    DataGridRow,
} from "@microsoft/fast-foundation";
import { DataGridCellStyles as cellStyles } from "./data-grid-cell.styles";
import { DataGridRowStyles as rowStyles } from "./data-grid-row.styles";
import { DataGridStyles as gridStyles } from "./data-grid.styles";

const gridTemplate: ViewTemplate = createDataGridTemplate("fast");
const rowTemplate: ViewTemplate = createDataGridRowTemplate("fast");
const cellTemplate: ViewTemplate = createDataGridCellTemplate("fast");

/**
 * The FAST Data Grid Element.
 *
 * @public
 * @remarks
 * HTML Element: `<fast-data-grid>`
 */
@customElement({
    name: "fast-data-grid",
    template: gridTemplate,
    styles: gridStyles,
})
export class FASTDataGrid extends DataGrid {}

/**
 * The FAST Data Grid Row Element.
 *
 * @public
 * @remarks
 * HTML Element: `<fast-data-grid-row>`
 */
@customElement({
    name: "fast-data-grid-row",
    template: rowTemplate,
    styles: rowStyles,
})
export class FASTDataGridRow extends DataGridRow {}

/**
 * The FAST Data Grid Cell Element.
 *
 * @public
 * @remarks
 * HTML Element: `<fast-data-grid-cell>`
 */
@customElement({
    name: "fast-data-grid-cell",
    template: cellTemplate,
    styles: cellStyles,
})
export class FASTDataGridCell extends DataGridCell {}

export { DataGridCellStyles } from "./data-grid-cell.styles";
export { DataGridRowStyles } from "./data-grid-row.styles";
export { DataGridStyles } from "./data-grid.styles";
