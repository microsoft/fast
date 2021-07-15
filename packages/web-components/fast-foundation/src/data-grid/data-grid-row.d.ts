import { ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import type { ColumnDefinition } from "./data-grid";
import { DataGridRowTypes } from "./data-grid.options";
/**
 * A Data Grid Row Custom HTML Element.
 *
 * @public
 */
export declare class DataGridRow extends FoundationElement {
    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the row
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    gridTemplateColumns: string;
    private gridTemplateColumnsChanged;
    /**
     * The type of row
     *
     * @public
     * @remarks
     * HTML Attribute: row-type
     */
    rowType: DataGridRowTypes;
    private rowTypeChanged;
    /**
     * The base data for this row
     *
     * @public
     */
    rowData: object | null;
    private rowDataChanged;
    /**
     * The column definitions of the row
     *
     * @public
     */
    columnDefinitions: ColumnDefinition[] | null;
    /**
     * The template used to render cells in generated rows.
     *
     * @public
     */
    cellItemTemplate?: ViewTemplate;
    private cellItemTemplateChanged;
    /**
     * The template used to render header cells in generated rows.
     *
     * @public
     */
    headerCellItemTemplate?: ViewTemplate;
    private headerCellItemTemplateChanged;
    /**
     * The index of the row in the parent grid.
     * This is typically set programmatically by the parent grid.
     *
     * @public
     */
    rowIndex: number;
    /**
     * Whether focus is on/in a cell within this row.
     *
     * @internal
     */
    isActiveRow: boolean;
    /**
     * The cell item template currently in use.
     *
     * @internal
     */
    activeCellItemTemplate?: ViewTemplate;
    /**
     * The default cell item template.  Set by the component templates.
     *
     * @internal
     */
    defaultCellItemTemplate?: ViewTemplate;
    /**
     * The default header cell item template.  Set by the component templates.
     *
     * @internal
     */
    defaultHeaderCellItemTemplate?: ViewTemplate;
    /**
     * Children that are cells
     *
     * @internal
     */
    cellElements: HTMLElement[];
    private cellsRepeatBehavior;
    private cellsPlaceholder;
    /**
     * @internal
     */
    slottedCellElements: HTMLElement[];
    /**
     * @internal
     */
    focusColumnIndex: number;
    private refocusOnLoad;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    handleFocusout(e: FocusEvent): void;
    handleCellFocus(e: Event): void;
    handleKeydown(e: KeyboardEvent): void;
    private updateItemTemplate;
    private updateRowStyle;
}
