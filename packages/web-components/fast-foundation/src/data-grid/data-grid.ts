import { attr, FASTElement, html, RepeatBehavior, RepeatDirective, observable, ViewTemplate } from "@microsoft/fast-element";

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
     * (i.e. "50px", "1fr", "20%", etc...), defaults to "auto"
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
    <fast-data-grid-row
        :columnsData="${(x, c) => c.parent.columnsData}"
        :rowData="${ x => x }"
    ></fast-data-grid-row>
`;

/**
 * A Data Grid Custom HTML Element.
*
 * @public
 */
export class DataGrid extends FASTElement {

    /**
     *  generates a basic column definition by examining sample row data
     */
    public static generateColumns = (row: object): DataGridColumn[] => {
        const definitions: DataGridColumn[] = [];
        const properties: string[] = Object.getOwnPropertyNames(row);
        properties.forEach((property: string) => {
            definitions.push({
                columnDataKey: property,
            });
        });
        return definitions;
    };

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
    public columnsData: DataGridColumn[] | null = null;
    private columnsDataChanged(): void {
    }

    /**
     * @internal
     */
    public slottedRowElements: HTMLElement[];

    /**
     * reference to the row container
     *
     * @internal
     */
    public gridRows: HTMLElement;

    /**
     * @internal
     */
    public slottedHeaderElements: HTMLElement[];

    @observable 
    public rowItemTemplate?: ViewTemplate = defaultRowItemTemplate;

    public rowsElement?: HTMLElement;

    private rowsRepeatBehavior?: RepeatBehavior;
    private rowsPlaceholder?: Node;

    constructor() {
        super();
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.columns !== undefined) {
            this.columnsData = JSON.parse(this.columns);
        }

        this.rowsPlaceholder = document.createComment("");
        this.rowsElement?.appendChild(this.rowsPlaceholder);

        this.rowsRepeatBehavior = new RepeatDirective(
             x => x.rowData,
             x => x.rowItemTemplate,
             { positioning: false }
        ).createBehavior(this.rowsPlaceholder);

        this.$fastController.addBehaviors([this.rowsRepeatBehavior!]);

        if (this.rows !== undefined) {
            this.rowData = JSON.parse(this.rows);
        }
    }
}
