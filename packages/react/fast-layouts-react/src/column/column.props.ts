import React from "react";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { GridDisplay } from "../utilities";
import { GridGutter } from "../grid/grid.props";
import { ColumnClassNamesContract } from "./column";

export type ColumnManagedClasses = ManagedClasses<ColumnClassNamesContract>;
export type ColumnUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
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

    /**
     * The value assigned to the CSS display property
     * Provide this prop when doing server side rendering
     */
    cssGridPropertyName?: GridDisplay;

    /**
     * The default breakpoint (helpful when rendering server-side)
     * Default to 0
     */
    defaultBreakpoint?: number;
}

export type ColumnProps = ColumnHandledProps & ColumnUnhandledProps;
