import { ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import type { DataGridCell } from "./data-grid-cell";
import { DataGridRowTypes, GenerateHeaderOptions } from "./data-grid.options";
export { DataGridRowTypes, GenerateHeaderOptions };
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
    headerCellTemplate?: ViewTemplate;
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
    headerCellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;
    /**
     * cell template
     */
    cellTemplate?: ViewTemplate;
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
    cellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;
}
/**
 * A Data Grid Custom HTML Element.
 *
 * @public
 */
export declare class DataGrid extends FoundationElement {
    /**
     *  generates a basic column definition by examining sample row data
     */
    static generateColumns: (row: object) => ColumnDefinition[];
    /**
     *  generates a gridTemplateColumns based on columndata array
     */
    private static generateTemplateColumns;
    /**
     *  Whether the grid should automatically generate a header row and its type
     *
     * @public
     * @remarks
     * HTML Attribute: generate-header
     */
    generateHeader: GenerateHeaderOptions;
    private generateHeaderChanged;
    /**
     * String that gets applied to the the css gridTemplateColumns attribute of child rows
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    gridTemplateColumns: string;
    private gridTemplateColumnsChanged;
    /**
     * The data being displayed in the grid
     *
     * @public
     */
    rowsData: object[];
    private rowsDataChanged;
    /**
     * The column definitions of the grid
     *
     * @public
     */
    columnDefinitions: ColumnDefinition[] | null;
    private columnDefinitionsChanged;
    /**
     * The template to use for the programmatic generation of rows
     *
     * @public
     */
    rowItemTemplate: ViewTemplate;
    /**
     * The template used to render cells in generated rows.
     *
     * @public
     */
    cellItemTemplate?: ViewTemplate;
    /**
     * The template used to render header cells in generated rows.
     *
     * @public
     */
    headerCellItemTemplate?: ViewTemplate;
    private headerCellItemTemplateChanged;
    /**
     * The index of the row that will receive focus the next time the
     * grid is focused. This value changes as focus moves to different
     * rows within the grid.  Changing this value when focus is already
     * within the grid moves focus to the specified row.
     *
     * @public
     */
    focusRowIndex: number;
    private focusRowIndexChanged;
    /**
     * The index of the column that will receive focus the next time the
     * grid is focused. This value changes as focus moves to different rows
     * within the grid.  Changing this value when focus is already within
     * the grid moves focus to the specified column.
     *
     * @public
     */
    focusColumnIndex: number;
    private focusColumnIndexChanged;
    /**
     * The default row item template.  Set by the component templates.
     *
     * @internal
     */
    defaultRowItemTemplate: ViewTemplate;
    /**
     * Set by the component templates.
     *
     */
    rowElementTag: string;
    /**
     * Children that are rows
     *
     * @internal
     */
    rowElements: HTMLElement[];
    private rowsRepeatBehavior;
    private rowsPlaceholder;
    private generatedHeader;
    private isUpdatingFocus;
    private pendingFocusUpdate;
    private observer;
    private rowindexUpdateQueued;
    private columnDefinitionsStale;
    private generatedGridTemplateColumns;
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @internal
     */
    handleRowFocus(e: Event): void;
    /**
     * @internal
     */
    handleFocus(e: FocusEvent): void;
    /**
     * @internal
     */
    handleFocusOut(e: FocusEvent): void;
    /**
     * @internal
     */
    handleKeydown(e: KeyboardEvent): void;
    private focusOnCell;
    private queueFocusUpdate;
    private updateFocus;
    private toggleGeneratedHeader;
    private onChildListChange;
    private queueRowIndexUpdate;
    private updateRowIndexes;
}
