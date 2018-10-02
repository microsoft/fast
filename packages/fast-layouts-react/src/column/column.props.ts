import { GridGutter } from "../grid/grid.props";
import { IColumnClassNamesContract } from "./column";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";

export interface IColumnHandledProps {
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

export type ColumnProps = IColumnHandledProps & IManagedClasses<IColumnClassNamesContract>;
