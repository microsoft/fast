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
    private rowChanged(): void {
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
    }

    /**
     * The column index
     * 
     * @public
     * @remarks
     * HTML Attribute: grid-ccolumn-index
     */
    @attr
    public gridColumnIndex: number;
    private columnIndexChanged(): void {
    }

    /**
     * The base data for the parent row
     *
     * @public
     */
    @observable
    public rowData: object | null = null;
    private rowDataChanged(): void {
    }

    /**
     * The base data for the column
     *
     * @public
     */
    @observable
    public columnData: DataGridColumn | null = null;
    private columnDataChanged(): void {
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

        this.style.gridColumn = `${this.gridColumnIndex === undefined ? 0 : this.gridColumnIndex}`;
    }

    /**
     * @internal
     */
    public resolveTemplate() {
        if (this.columnData?.cellTemplate !== undefined && this.columnData?.cellTemplate !== null) {
            return this.columnData?.cellTemplate
        }

        return DataGridCellTemplate;
    }
}
