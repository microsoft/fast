import {
    dataGridCellTemplate,
    dataGridRowTemplate,
    dataGridTemplate,
    DataGrid,
    DataGridCell,
    DataGridRow,
} from "@microsoft/fast-foundation";
import { dataGridStyles as gridStyles } from "./data-grid.styles";
import { dataGridRowStyles as rowStyles } from "./data-grid-row.styles";
import { dataGridCellStyles as cellStyles } from "./data-grid-cell.styles";

/**
 * A function that returns a Data Grid Cell registration for configuring the component with a DesignSystem.
 * 
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-data-grid-cell\>
 */
export const /* @echo namespace */DataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate,
    styles: cellStyles,
});

/**
 * Styles for DataGrid cell
 * @public
 */
export const dataGridCellStyles = cellStyles;

/**
 * A function that returns a Data Grid Row registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-data-grid-row\>
 */
export const /* @echo namespace */DataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate,
    styles: rowStyles,
});

/**
 * Styles for DataGrid row
 * @public
 */
export const dataGridRowStyles = rowStyles;

/**
 * A function that returns a Data Grid registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-data-grid\>
 */
export const /* @echo namespace */DataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate,
    styles: gridStyles,
});

/**
 * Styles for DataGrid
 * @public
 */
export const dataGridStyles = gridStyles;

/**
 * Base class for DataGrid
 * @public
 */
export { DataGrid };

/**
 * Base class for DataGridRow
 * @public
 */
export { DataGridRow };

/**
 * Base class for DataGridCell
 * @public
 */
export { DataGridCell };
