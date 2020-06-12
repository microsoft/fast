import React from "react";
import {
    DataGridClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export type DataGridManagedClasses = ManagedClasses<DataGridClassNameContract>;
export type DataGridUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface DataGridCellRenderConfig {
    rowData: object;
    columnDataKey: React.ReactText;
    columnIndex: number;
    classNames: string;
    rootElement: React.RefObject<any>;
    focusTarget: React.RefObject<any>;
    unhandledProps: object;
}

export interface DataGridHeaderRenderConfig {
    title: React.ReactNode;
    key: React.ReactText;
    columnIndex: number;
    classNames: string;
}

export interface DataGridRowHeightCallbackParams {
    rowData: object;
    rowIndex: number;
    defaultRowHeight: number;
}

export interface DataGridColumn {
    /**
     * identifies the data item to be displayed in this column
     * (i.e. how the data item is labelled in each row)
     */
    columnDataKey: React.ReactText;

    /**
     *  Column title, if not provided columnDataKey is used as title
     */
    title?: React.ReactNode;

    /**
     * The width of the column in a form compatible with css grid column widths
     * (i.e. "50px", "1fr", "20%", etc...), defaults to "1fr"
     */
    columnWidth?: string;

    /**
     *  Custom render function for the header cell of the column
     */
    header?: (config: DataGridHeaderRenderConfig) => React.ReactNode;

    /**
     * Custom render function for a data cells in the column
     */
    cell?: (config: DataGridCellRenderConfig) => React.ReactNode;
}

export interface DataGridHandledProps extends DataGridManagedClasses {
    /**
     * Data to be displayed in the grid
     * An array of data items for each row is expected
     */
    rows: object[];

    /**
     * the field which uniquely identifies each data row
     */
    dataRowKey: React.ReactText;

    /**
     * Array of column definitions specify how to display each column
     */
    columns?: DataGridColumn[];

    /**
     * Default focus row key
     * This row will be in view when the grid loads.
     * Changing this prop during the component lifetime
     * to a non-null value will also move the new row into view.
     */
    defaultFocusRowKey?: React.ReactText;

    /**
     * Default focus column key
     */
    defaultFocusColumnKey?: React.ReactText;

    /**
     * When true some out of view rows are not rendered to the DOM to increase performance,
     * default is false
     */
    virtualize?: boolean;

    /**
     * The default height in pixels of each row
     * This setting only applies when virtualizationItems is true.
     */
    rowHeight?: number;

    /**
     * Data page size in number of rows.
     * This setting only applies when virtualizationItems is true.
     * This is the maximum number of items that will be converted to data row items passed to the
     * underlying panel display at any one time.
     * default is 1000
     */
    pageSize?: number;

    /**
     * This callback function overrides the rowHeight prop and will be called for each
     * This setting only applies when virtualizationItems is true.
     * row of data when the rows are updated in props.  Allows for non-uniform row heights.
     */
    rowHeightCallback?: (row: DataGridRowHeightCallbackParams) => number;

    /**
     * If props have been updated this is the end index of the range of data items, starting at index 0, that are guaranteed not to
     * require recalculating size since the last prop update.  This is an optimization for large data sets.
     * This setting only applies when virtualizationItems is true.
     * ie. if changes resize the item at index 10, the stable range end should be 9
     * default is 0
     */
    stableRangeEndIndex?: number;
}

export type DataGridProps = DataGridHandledProps & DataGridUnhandledProps;
