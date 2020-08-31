import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { DataGridColumn } from './data-grid';

/**
 * A Data Grid header Custom HTML Element.
*
 * @public
 */
export class DataGridHeader extends FASTElement {
     /**
     * The column definitions of the header
     *
     * @public
     */
    @observable
    public columnDefinitions: DataGridColumn[]  = [];
    private columnDefinitionsChanged(): void {
        // this.requestReset();
    }
}
