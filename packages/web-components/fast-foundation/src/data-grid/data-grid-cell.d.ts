import { FoundationElement } from "../foundation-element";
import type { ColumnDefinition } from "./data-grid";
import { DataGridCellTypes } from "./data-grid.options";
export { DataGridCellTypes };
/**
 * A Data Grid Cell Custom HTML Element.
 *
 * @public
 */
export declare class DataGridCell extends FoundationElement {
    /**
     * The type of cell
     *
     * @public
     * @remarks
     * HTML Attribute: cell-type
     */
    cellType: DataGridCellTypes;
    private cellTypeChanged;
    /**
     * The column index of the cell.
     * This will be applied to the css grid-column-index value
     * applied to the cell
     *
     * @public
     * @remarks
     * HTML Attribute: grid-column
     */
    gridColumn: string;
    private gridColumnChanged;
    /**
     * The base data for the parent row
     *
     * @public
     */
    rowData: object | null;
    /**
     * The base data for the column
     *
     * @public
     */
    columnDefinition: ColumnDefinition | null;
    private columnDefinitionChanged;
    private isActiveCell;
    private customCellView;
    private isInternalFocused;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    handleFocusin(e: FocusEvent): void;
    handleFocusout(e: FocusEvent): void;
    handleKeydown(e: KeyboardEvent): void;
    private updateCellView;
    private disconnectCellView;
    private updateCellStyle;
}
