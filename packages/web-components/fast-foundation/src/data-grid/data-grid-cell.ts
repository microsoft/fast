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
