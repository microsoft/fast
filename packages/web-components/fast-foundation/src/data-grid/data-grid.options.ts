import type { SyntheticViewTemplate, ViewTemplate } from "@microsoft/fast-element";
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

/**
 * Event detail for DataGridRow row/cell selectionchanged events
 *
 * @internal
 */
export interface DataGridSelectionChangeDetail {
    // the new selected value
    newValue: boolean;

    // if the shiftKey is pressed
    shiftKey: boolean;

    // if the control key is pressed
    ctrlKey: boolean;

    // is keyboard event
    isKeyboardEvent: boolean;
}

/**
 * Enumerates the data grid selection mode options
 *
 * @public
 */
export const DataGridSelectionMode = {
    none: "none",
    singleRow: "single-row",
    multiRow: "multi-row",
} as const;

/**
 * The types for the data grid selection mode options
 *
 * @public
 */
export type DataGridSelectionMode = ValuesOf<typeof DataGridSelectionMode>;

/**
 * Enumerates the data grid selection behavior options
 *
 * @public
 */
export const DataGridSelectionBehavior = {
    programmatic: "programmatic",
    keyboardOnly: "keyboard-only",
    auto: "auto",
} as const;

/**
 * The types for the data grid selection mode options
 *
 * @public
 */
export type DataGridSelectionBehavior = ValuesOf<typeof DataGridSelectionBehavior>;

/**
 * Defines a column in the grid
 *
 * @public
 */
export interface ColumnDefinition {
    /**
     * Identifies the data item to be displayed in this column
     * (i.e. how the data item is labelled in each row)
     */
    columnDataKey: string;

    /**
     * Sets the css grid-column property on the cell which controls its placement in
     * the parent row. If left unset the cells will set this value to match the index
     * of their column in the parent collection of ColumnDefinitions.
     */
    gridColumn?: string;

    /**
     *  Column title, if not provided columnDataKey is used as title
     */
    title?: string;

    /**
     *  Header cell template
     */
    headerCellTemplate?: ViewTemplate | SyntheticViewTemplate;

    /**
     * Whether the header cell has an internal focus queue
     */
    headerCellInternalFocusQueue?: boolean;

    /**
     * Callback function that returns the element to focus in a custom cell.
     * When headerCellInternalFocusQueue is false this function is called when the cell is first focused
     * to immediately move focus to a cell element, for example a cell that is a checkbox could move
     * focus directly to the checkbox.
     * When headerCellInternalFocusQueue is true this function is called when the user hits Enter or F2
     */
    headerCellFocusTargetCallback?: (cell: HTMLElement) => HTMLElement;

    /**
     * cell template
     */
    cellTemplate?: ViewTemplate | SyntheticViewTemplate;

    /**
     * Whether the cell has an internal focus queue
     */
    cellInternalFocusQueue?: boolean;

    /**
     * Callback function that returns the element to focus in a custom cell.
     * When cellInternalFocusQueue is false this function is called when the cell is first focused
     * to immediately move focus to a cell element, for example a cell that is a checkbox could move
     * focus directly to the checkbox.
     * When cellInternalFocusQueue is true this function is called when the user hits Enter or F2
     */

    cellFocusTargetCallback?: (cell: HTMLElement) => HTMLElement;

    /**
     * Whether this column is the row header
     */
    isRowHeader?: boolean;
}
