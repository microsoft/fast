import { attr, FASTElement, html, observable, ViewTemplate } from "@microsoft/fast-element";
import { DataGridColumn } from './data-grid';

const defaultRowItemTemplate = html`
    <fast-data-grid-row></fast-data-grid-row>
`;

/**
 * A Data Grid Row Custom HTML Element.
*
 * @public
 */
export class DataGridRows extends FASTElement {
    /**
     * The base data for this row
     *
     * @public
     */
    @observable
    public rowElements: object[] = [];
    private rowElementsChanged(): void {
        // this.requestReset();
    }

     /**
     * The column definitions of the grid
     *
     * @public
     */
    @observable
    public columnDefinitions: DataGridColumn[]  = [];
    private columnDefinitionsChanged(): void {
        // this.requestReset();
    }

    @observable 
    public rowItemTemplate?: ViewTemplate = defaultRowItemTemplate;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
    }
}
