import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { DataGridColumn } from  "./data-grid";
import { DataGridCellTemplate } from "./data-grid-cell.template";

/**
 * A Data Grid Cell Custom HTML Element.
*
 * @public
 */
export class DataGridCell extends FASTElement {
    /**
     * The base data for the parent row as a JSON string
     * 
     * @public
     * @remarks
     * HTML Attribute: row
     */
    @attr
    public row: string;
    private rowsChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            //
        }
    }

    /**
     * The base data for the column as a JSON string
     * 
     * @public
     * @remarks
     * HTML Attribute: row
     */
    @attr
    public column: string;
    private columnChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            //
        }
    }

    /**
     * The base data for the parent row
     *
     * @public
     */
    @observable
    public rowData: object | null = null;
    private rowDataChanged(): void {
        // this.requestReset();
    }

    /**
     * The base data for the column
     *
     * @public
     */
    @observable
    public columnData: DataGridColumn | null = null;
    private columnDataChanged(): void {
        // this.requestReset();
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        
        if (this.column !== undefined) {
            this.columnData = JSON.parse(this.column);
        }

        if (this.row !== undefined) {
            this.rowData = JSON.parse(this.row);
        }
    }

    /**
     * @internal
     */
    resolveTemplate() {
        return DataGridCellTemplate;
    }
}
