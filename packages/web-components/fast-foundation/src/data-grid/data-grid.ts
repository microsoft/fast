import { attr, FASTElement, observable } from "@microsoft/fast-element";
/**
 * A Data Grid Custom HTML Element.
*
 * @public
 */
export class DataGrid extends FASTElement {

    /**
     * The data to be displayed in the grid in JSON format
     * 
     * @public
     * @remarks
     * HTML Attribute: data
     */
    @attr
    public rows: string;
    private rowsChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            //
        }
    }

    /**
     * The key that uniquely identifies each data row
     * 
     * @public
     * @remarks
     * HTML Attribute: rowkey
     */
    @attr
    public rowkey: string;
    private rowkeyChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            // 
        }
    }

    /**
     * The column definitions of the grid in JSON format
     * 
     * @public
     * @remarks
     * HTML Attribute: data
     */
    @attr
    public columns: string;
    private columnsChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            // 
        }
    }

    /**
     * The data being displayed in the grid
     *
     * @public
     */
    @observable
    public rowData: object[] | null = null;
    private rowDataChanged(): void {
    }

    /**
     * The column definitions of the grid
     *
     * @public
     */
    @observable
    public columnD: object[] | null = null;
    private columnDefinitionsChanged(): void {
        // this.requestReset();
    }
}
