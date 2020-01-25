import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { DataGridColumnDefinition } from "./data-grid.props";

export const CellIdKey: string = "data-cellid";

export interface DataGridCellClassNameContract {
    dataGridCell?: string;
}

export interface DataGridCellManagedClasses
    extends ManagedClasses<DataGridCellClassNameContract> {}

export interface DataGridCellUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export interface DataGridCellHandledProps extends DataGridCellManagedClasses {
    /**
     *  Data for this row
     */
    rowData: object;

    /**
     * Column definition for this row
     */
    columnDefinition: DataGridColumnDefinition;

    /**
     * The column index
     */
    columnIndex: number;
}

export type DataGridCellProps = DataGridCellHandledProps & DataGridCellUnhandledProps;
