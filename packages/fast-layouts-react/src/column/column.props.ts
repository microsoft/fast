import * as React from "react";
import { GridGutter } from "../grid/grid.props";
import { ColumnClassNamesContract } from "./column";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface ColumnManagedClasses extends ManagedClasses<ColumnClassNamesContract> {}
export interface ColumnUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ColumnHandledProps extends ColumnManagedClasses {
    /**
     * The number of columns a column should span. If an array is passed, each index of the array corresponds to
     * a break-point in ascending order.
     */
    span?: number | number[];

    /**
     * The column position the column should occupy
     */
    position?: number | number[];

    /**
     * The row that the column should occupy. Use this option to support -ms-grid
     */
    row?: number | number[];

    /**
     * The order of a column relative to all other columns in the grid
     */
    order?: number | number[];

    /**
     * The gutter size of the parent Grid component
     */
    gutter?: GridGutter;
}

export type ColumnProps = ColumnHandledProps & ColumnHandledProps;
