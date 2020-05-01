import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface DataGridRowClassNameContract {
    dataGridRow?: string;
    dataGridRow__focusWithin?: string;
    dataGridRow_cell?: string;
}

export const RowIdKey: string = "data-rowid";

export interface DataGridRowManagedClasses
    extends ManagedClasses<DataGridRowClassNameContract> {}

export interface DataGridRowUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DataGridRowHandledProps extends DataGridRowManagedClasses {
    /**
     * The base data for this row
     */
    rowData: object;

    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the row
     */
    gridTemplateColumns: string;

    /**
     * The row's index in the parent data grid
     */
    rowIndex: number;
}

export type DataGridRowProps = DataGridRowHandledProps & DataGridRowUnhandledProps;
