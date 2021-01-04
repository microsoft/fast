/**
 * Enumerates auto generated header options
 * default option generates a non-sticky header row
 *
 * @public
 */
export enum GenerateHeaderOptions {
    none = "none",
    default = "default",
    sticky = "sticky",
}

/**
 * Enumerates possible cell types.
 *
 * @public
 */
export enum DataGridCellTypes {
    default = "default",
    columnHeader = "columnheader",
}

/**
 * Enumerates possible row types
 *
 * @public
 */
export enum DataGridRowTypes {
    default = "default",
    header = "header",
    stickyHeader = "sticky-header",
}
