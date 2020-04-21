/**
 * The class name contract for the data grid component
 */
export interface DataGridClassNameContract {
    /**
     * The root of the data grid component
     */
    dataGrid?: string;

    /**
     * The header of the data grid component
     */
    dataGrid_header?: string;

    /**
     * The column header of the data grid component
     */
    dataGrid_columnHeader?: string;

    /**
     * The rows of the data grid component
     */
    dataGrid_row?: string;

    /**
     * Applied when focus is in a particular row
     */
    dataGrid_row__focusWithin?: string;

    /**
     * A cell within the data grid component
     */
    dataGrid_cell?: string;
}
