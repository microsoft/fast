import {
    DataGrid,
    DataGridCell,
    dataGridCellTemplate,
    DataGridRow,
    dataGridRowTemplate,
    dataGridTemplate,
} from "@microsoft/fast-foundation";
import { dataGridStyles } from "./data-grid.styles.js";
import { dataGridRowStyles } from "./data-grid-row.styles.js";
import { dataGridCellStyles } from "./data-grid-cell.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGridCell} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-data-grid-cell>`
 */
export const fastDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate,
    styles: dataGridCellStyles,
});

/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGridRow} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-data-grid-row>`
 */
export const fastDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate,
    styles: dataGridRowStyles,
});

/**
 * A function that returns a {@link @microsoft/fast-foundation#DataGrid} registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-data-grid>`
 */
export const fastDataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate,
    styles: dataGridStyles,
});

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

export { dataGridCellStyles, dataGridStyles, dataGridRowStyles };
