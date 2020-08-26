import { attr, FASTElement, html, RepeatBehavior, RepeatDirective, observable, ViewTemplate, } from "@microsoft/fast-element";

/**
 * Defines a column in the grid
*
 * @public
 */
export interface DataGridColumn {
    /**
     * identifies the data item to be displayed in this column
     * (i.e. how the data item is labelled in each row)
     */
    columnDataKey: string;

    /**
     *  Column title, if not provided columnDataKey is used as title
     */
    title?: string;

    /**
     * The width of the column in a form compatible with css grid column widths
     * (i.e. "50px", "1fr", "20%", etc...), defaults to "1fr"
     */
    columnWidth?: string;

    /**
     *  header template
     */
    headerTemplate?: ViewTemplate;

    /**
     * cell template
     */
    cellTemplate?: ViewTemplate;
}

const defaultRowItemTemplate = html`
    <fast-data-grid-row></fast-data-grid-row>
`;

const defaultHeaderItemTemplate = html`
    <div>BOO!</div>
`;


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
    public rowData: object[] = [];
    private rowDataChanged(): void {
    }

    /**
     * The column definitions of the grid
     *
     * @public
     */
    @observable
    public columnDefinitions: DataGridColumn[] | null = null;
    private columnDefinitionsChanged(): void {
        // this.requestReset();
    }

    /**
     * @internal
     */
    public headerElement: HTMLDivElement;

    /**
     * @internal
     */
    public gridElement: HTMLDivElement;

    private rowsRepeatBehavior?: RepeatBehavior;
    private rowsPlaceholder?: Node;
    @observable 
    public rowItemTemplate?: ViewTemplate = defaultRowItemTemplate;

    private headerRepeatBehavior?: RepeatBehavior;
    private headerPlaceholder?: Node;
    @observable 
    public headerItemTemplate?: ViewTemplate = defaultHeaderItemTemplate;

    constructor() {
        super();
    }


    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.rowsPlaceholder = document.createComment("");
        this.gridElement.appendChild(this.rowsPlaceholder);

        this.rowsRepeatBehavior = new RepeatDirective(
            x => x.rowData,
            x => x.rowItemTemplate,
            { positioning: false }
        ).createBehavior(this.rowsPlaceholder);

        this.headerPlaceholder = document.createComment("");
        this.appendChild(this.headerPlaceholder);

        this.headerRepeatBehavior = new RepeatDirective(
            x => x.columnDefinitions,
            x => x.headerItemTemplate,
            { positioning: false }
        ).createBehavior(this.headerPlaceholder);

        this.$fastController.addBehaviors([this.rowsRepeatBehavior!, this.headerRepeatBehavior!]);

        if (this.rows !== undefined) {
            this.rowData = JSON.parse(this.rows);
        }

        if (this.columns !== undefined) {
            this.columns = JSON.parse(this.columns);
        }
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}
