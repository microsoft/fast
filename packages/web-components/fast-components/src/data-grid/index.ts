import { customElement } from "@microsoft/fast-element";
import { DataGrid, DataGridTemplate as gridTemplate,  DataGridRow, DataGridRowTemplate as gridRowTemplate  } from "@microsoft/fast-foundation";
import { DataGridStyles as gridStyles } from "./data-grid.styles";
import { DataGridRowStyles as rowStyles } from "./data-grid-row.styles";

/**
 * The FAST Data Grid Element. 
 *
 * @public
 * @remarks
 * HTML Element: \<fast-data-grid\>
 */
@customElement({
    name: "fast-data-grid",
    template: gridTemplate,
    styles: gridStyles,
})
export class FASTDataGrid extends DataGrid {}

/**
 * Styles for DataGrid
 * @public
 */
export const DataGridStyles = gridStyles;


/**
 * The FAST Data Grid Row Element. 
 *
 * @public
 * @remarks
 * HTML Element: \<fast-data-grid-row\>
 */
@customElement({
    name: "fast-data-grid-row",
    template: gridRowTemplate,
    styles: rowStyles,
})
export class FASTDataGridRow extends DataGridRow {}

/**
 * Styles for DataGrid
 * @public
 */
export const DataGridRowStyles = rowStyles;

