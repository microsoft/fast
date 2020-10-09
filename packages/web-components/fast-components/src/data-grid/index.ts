import { customElement } from "@microsoft/fast-element";
import {
    DataGrid,
    DataGridTemplate as gridTemplate,
    DataGridHeader,
    DataGridHeaderTemplate as gridHeaderTemplate,
    DataGridHeaderCell,
    DataGridHeaderCellTemplate as gridHeaderCellTemplate,
    DataGridRow,
    DataGridRowTemplate as gridRowTemplate,
    DataGridCell,
    DataGridCellTemplate as gridCellTemplate,
} from "@microsoft/fast-foundation";
import { DataGridStyles as gridStyles } from "./data-grid.styles";
import { DataGridHeaderStyles as headerStyles } from "./data-grid-header.styles";
import { DataGridHeaderCellStyles as headerCellStyles } from "./data-grid-header-cell.styles";
import { DataGridRowStyles as rowStyles } from "./data-grid-row.styles";
import { DataGridCellStyles as cellStyles } from "./data-grid-cell.styles";

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
 * The FAST Data Grid Header Element.
 *
 * @public
 * @remarks
 * HTML Element: \<fast-data-grid-header\>
 */
@customElement({
    name: "fast-data-grid-header",
    template: gridHeaderTemplate,
    styles: headerStyles,
})
export class FASTDataGridHeader extends DataGridHeader {}

/**
 * Styles for DataGrid header
 * @public
 */
export const DataGridHeaderStyles = headerStyles;

/**
 * The FAST Data Grid Header Cell Element.
 *
 * @public
 * @remarks
 * HTML Element: \<fast-data-grid-header-cell\>
 */
@customElement({
    name: "fast-data-grid-header-cell",
    template: gridHeaderCellTemplate,
    styles: headerCellStyles,
})
export class FASTDataGridHeaderCell extends DataGridHeaderCell {}

/**
 * Styles for DataGrid header cell
 * @public
 */
export const DataGridHeaderCellStyles = headerCellStyles;

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
 * Styles for DataGrid row
 * @public
 */
export const DataGridRowStyles = rowStyles;

/**
 * The FAST Data Grid Cell Element.
 *
 * @public
 * @remarks
 * HTML Element: \<fast-data-grid-cell\>
 */
@customElement({
    name: "fast-data-grid-cell",
    template: gridCellTemplate,
    styles: cellStyles,
})
export class FASTDataGridCell extends DataGridCell {}

/**
 * Styles for DataGrid cell
 * @public
 */
export const DataGridCellStyles = cellStyles;
