import { attr, FASTElement, observable } from "@microsoft/fast-element";
/**
 * A Data Grid Cell Custom HTML Element.
*
 * @public
 */
export class DataGridCell extends FASTElement {
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
