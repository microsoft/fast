import { attr, DOM, FASTElement, observable, html, HTMLView, ViewTemplate } from "@microsoft/fast-element";
import { DataGridColumn } from  "./data-grid";
import { DataGridCellTemplate } from "./data-grid-cell.template";

const defaultCellContentsTemplate: ViewTemplate = html<any>`
    <template>
        ${x => (x.rowData === null || x.columnData === null || x.columnData.columnDataKey === null) ? null : x.rowData[x.columnData.columnDataKey]}
    </template>
`; 

/**
 * Data grid cell config
*
 * @public
 */
export interface DataGridCellConfig {
    /**
     * 
     */
    columnData: DataGridColumn;


    /**
     * 
     */
    rowData: object;
}


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
        if (
            (this as FASTElement).$fastController.isConnected
        ) {
            DOM.queueUpdate(this.update);
        }
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
     * 
     *
     * @public
     */
    @observable
    public cellConfig: DataGridCellConfig | null = null;
    private cellConfigChanged(): void {
    }

    private customCellView: HTMLView | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    
        this.style.gridColumn = `${this.gridColumnIndex === undefined ? 0 : this.gridColumnIndex}`;

        this.update();

        if (this.columnData?.cellTemplate !== undefined && this.cellConfig !== null) {
            this.customCellView = this.columnData.cellTemplate.render(this.cellConfig, this);
        } else {
            this.customCellView = defaultCellContentsTemplate.render(this.cellConfig, this);
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

    private update = (): void =>  {
        if (
            this.columnData === null ||
            this.rowData === null
        ) {
            return;
        }

        this.cellConfig = {
            columnData: this.columnData,
            rowData: this.rowData
        }
    }
}
