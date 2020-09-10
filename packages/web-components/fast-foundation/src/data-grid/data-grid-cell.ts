import { attr, FASTElement, observable, html, HTMLView } from "@microsoft/fast-element";
import { DataGridColumn } from  "./data-grid";
import { DataGridCellTemplate } from "./data-grid-cell.template";

const defaultCellContentsTemplate = html<DataGridCell>`
    <template>
        ${x => (x.rowData === null || x.columnData === null || x.columnData.columnDataKey === null) ? null : x.rowData[x.columnData.columnDataKey]}
    </template>
`; 

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

    private customCellView: HTMLView | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    
        this.style.gridColumn = `${this.gridColumnIndex === undefined ? 0 : this.gridColumnIndex}`;

        if (this.columnData?.cellTemplate !== undefined) {
            this.customCellView = this.columnData.cellTemplate.render(this, this);
        } else {
            this.customCellView = defaultCellContentsTemplate.render(this, this);
        }
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.customCellView !== null) {
            this.customCellView.unbind();
            this.customCellView = null;
        }
    }
}
