import { customElement } from "@microsoft/fast-element";
import { DataGrid, DataGridTemplate as template } from "@microsoft/fast-foundation";
import { DataGridStyles as styles } from "./data-grid.styles";

/**
 * The FAST Data Grid Element. 
 *
 * @public
 * @remarks
 * HTML Element: \<fast-data-grid\>
 */
@customElement({
    name: "fast-data-grid",
    template,
    styles,
})
export class FASTDataGrid extends DataGrid {}

/**
 * Styles for DataGrid
 * @public
 */
export const DataGridStyles = styles;
