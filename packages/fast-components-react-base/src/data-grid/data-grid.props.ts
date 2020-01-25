import React from "react";
import {
    ManagedClasses,
    DataGridClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { DataGridCellProps, DataGridCellUnhandledProps } from "./data-grid-cell.props";
import { strictEqual } from "assert";

export interface DataGridManagedClasses
    extends ManagedClasses<DataGridClassNameContract> {}
export interface DataGridUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DataGridColumnDefinition {
    /**
     * identifies the data item to be displayed in this column
     * (i.e. how the data item is labelled in each row)
     */
    columnDataKey: React.ReactText;

    /**
     *  Column title
     */
    title: React.ReactNode;

    /**
     * The width of the column in a form compatible with css grid column widths
     * (i.e. "50px", "1fr", "20%", etc...)
     */
    columnWidth: string;

    /**
     *  Custom render function for the header cell of the column
     */
    header?: (
        title: React.ReactNode,
        key: React.ReactText,
        columnIndex: number,
        className: string
    ) => React.ReactNode;

    /**
     * Custom render function for a data cells in the column
     */
    cell?: (
        props: DataGridCellProps,
        className: string,
        cellId: React.ReactText,
        unhandledProps: object
    ) => React.ReactNode;
}

export interface DataGridHandledProps extends DataGridManagedClasses {
    /**
     * Data to be displayed in the grid
     * An array of data items for each row is expected
     */
    gridData: object[];

    /**
     * If props have been updated this is the end index of the range of data items, starting at index 0, that are guaranteed not to
     * require recalculating size since the last prop update.  This is an optimization for large data sets.
     * ie. if changes resize the item at index 10, the stable range end should be 9
     * default is 0
     */
    stableRangeEndIndex?: number;

    /**
     * Data page size in number of rows
     * default is 1000
     */
    pageSize?: number;

    /**
     * the field which uniquely identifies each data row
     */
    dataRowKey: React.ReactText;

    /**
     * Array of column definitions specify how to display each column
     */
    columnDefinitions: DataGridColumnDefinition[];

    /**
     *  The default height in pixels of each row
     */
    itemHeight?: number;

    /**
     * This callback function overrides the itemHeight prop and will be called for each
     * row of data when the gridData is updated in props.  Allows for non-uniform row heights.
     */
    itemHeightCallback?: (
        rowData: object,
        rowIndex: number,
        defaultItemHeight: number
    ) => number;

    /**
     * Default focus row index
     */
    defaultFocusRowIndex?: number;

    /**
     * Default focus column key
     */
    defaultFocusColumnKey?: React.ReactText;
}

export type DataGridProps = DataGridHandledProps & DataGridUnhandledProps;
