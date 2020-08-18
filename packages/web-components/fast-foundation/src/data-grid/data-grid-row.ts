import { attr, FASTElement, observable } from "@microsoft/fast-element";
/**
 * A Data Grid Custom HTML Element.
*
 * @public
 */
export class DataGridRow extends FASTElement {
    /**
     * The base data for this row
     *
     * @public
     */
    @observable
    public rowData: object | null = null;
    private rowDataChanged(): void {
        // this.requestReset();
    }

    /**
     * The row's index in the parent data grid
     *
     * @public
     */
    @observable
    public rowIndex: object | null = null;
    private rowIndexChanged(): void {
        // this.requestReset();
    }

    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the row
     *
     * @public
     */
    @observable
    public gridTemplateColumn: object | null = null;
    private gridTemplateColumnChanged(): void {
        // this.requestReset();
    }
}
