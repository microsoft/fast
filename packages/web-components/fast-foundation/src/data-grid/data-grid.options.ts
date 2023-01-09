import type { ValuesOf } from "../utilities/index.js";

/**
 * Enumerates the data grid auto generated header options
 * default option generates a non-sticky header row
 *
 * @public
 */
export const GenerateHeaderOptions = {
    none: "none",
    default: "default",
    sticky: "sticky",
} as const;

/**
 * The types for the data grid auto generated header options
 *
 * @public
 */
export type GenerateHeaderOptions = ValuesOf<typeof GenerateHeaderOptions>;

/**
 * Enumerates possible data grid cell types.
 *
 * @public
 */
export const DataGridCellTypes = {
    default: "default",
    columnHeader: "columnheader",
    rowHeader: "rowheader",
} as const;

/**
 * The possible cell types.
 *
 * @public
 */
export type DataGridCellTypes = ValuesOf<typeof DataGridCellTypes>;

/**
 * Enumerates possible data grid row types
 *
 * @public
 */
export const DataGridRowTypes = {
    default: "default",
    header: "header",
    stickyHeader: "sticky-header",
} as const;

/**
 * The possible data grid row types
 *
 * @public
 */
export type DataGridRowTypes = ValuesOf<typeof DataGridRowTypes>;

/**
 * Class names for the data grid cell
 * @public
 */
export const DataGridCellTypeClass = {
    columnheader: "column-header",
    default: "",
    rowheader: "row-header",
} as const;

/**
 * Types for the data grid cell class names
 * @public
 */
export type DataGridCellTypeClass = ValuesOf<typeof DataGridCellTypeClass>;

/**
 * Roles for the data grid cell
 *
 * @public
 */
export const DataGridCellRole = {
    columnheader: "columnheader",
    rowheader: "rowheader",
    default: "gridcell",
} as const;

/**
 * Type for the data grid cell roles
 * @public
 */
export type DataGridCellRole = ValuesOf<typeof DataGridCellRole>;
