import {
    attr,
    FASTElement,
    html,
    RepeatBehavior,
    RepeatDirective,
    observable,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DataGridColumn } from "./data-grid";

const defaultCellItemTemplate = html`
    <fast-data-grid-cell
        gridColumnIndex="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnData="${x => x}"
    ></fast-data-grid-cell>
`;

/**
 * A Data Grid Row Custom HTML Element.
 *
 * @public
 */
export class DataGridRow extends FASTElement {
    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the row
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    @attr
    public gridTemplateColumns: string;
    private gridTemplateColumnsChanged(): void {}

    /**
     * The base data for this row
     *
     * @public
     */
    @observable
    public rowData: object | null = null;
    private rowDataChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
        }
    }

    /**
     * The column definitions of the row
     *
     * @public
     */
    @observable
    public columnsData: DataGridColumn[] | null = null;
    private columnsDataChanged(): void {}

    /**
     *
     *
     * @public
     */
    @observable cellElements?: object[];
    private cellElementsChanged() {}

    private cellsRepeatBehavior?: RepeatBehavior;
    private cellsPlaceholder?: Node;

    /**
     * @internal
     */
    public slottedCellElements: HTMLElement[];

    @observable
    public cellItemTemplate?: ViewTemplate = defaultCellItemTemplate;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.cellsPlaceholder = document.createComment("");
        this.appendChild(this.cellsPlaceholder);

        this.cellsRepeatBehavior = new RepeatDirective(
            x => x.columnsData,
            x => x.cellItemTemplate,
            { positioning: true }
        ).createBehavior(this.cellsPlaceholder);

        this.$fastController.addBehaviors([this.cellsRepeatBehavior!]);

        this.updateRowStyle();
    }

    // /**
    //  *  gets the current column configuration
    //  */
    // private getColumns = (): DataGridColumn[] => {
    //     return (this.columns === undefined)
    //         ? (this.rowData !== null)
    //             ? DataGrid.generateColumns(this.rowData)
    //             : null
    //         : JSON.parse(this.columns);;
    // };

    /**
     *  Updates the style string applied to the region element as well as the css classes attached
     *  to the root element
     */
    private updateRowStyle = (): void => {
        this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
}
