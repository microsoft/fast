import React from "react";
import {
    DataGridRowClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export const RowIdKey: string = "data-rowid";

export type DataGridRowManagedClasses = ManagedClasses<DataGridRowClassNameContract>;
export type DataGridRowUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

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
