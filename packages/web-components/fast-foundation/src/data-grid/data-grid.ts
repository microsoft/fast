import {
    attr,
    FASTElement,
    html,
    RepeatBehavior,
    RepeatDirective,
    observable,
    ViewTemplate,
} from "@microsoft/fast-element";

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
    headerCellTemplate?: ViewTemplate;

    /**
     * cell template
     */
    cellTemplate?: ViewTemplate;
}

const defaultRowItemTemplate = html`
    <fast-data-grid-row
        :columnsData="${(x, c) => c.parent.columnsData}"
        :rowData="${x => x}"
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
     *
     *
     * @public
     * @remarks
     * HTML Attribute: generate-header
     */
    @attr({ attribute: "generate-header", mode: "boolean" })
    public generateHeader: boolean = true;
    private generateHeaderChanged(): void {}

    /**
     * The data being displayed in the grid
     *
     * @public
     */
    @observable
    public rowsData: object[] = [];
    private rowsDataChanged(): void {}

    /**
     * The column definitions of the grid
     *
     * @public
     */
    @observable
    public columnsData: DataGridColumn[] | null = null;
    private columnsDataChanged(): void {}


    /**
     * The template to use for the programmatic generation of rows
     *
     * @public
     */
    @observable
    public rowItemTemplate: ViewTemplate = defaultRowItemTemplate;
    private rowItemTemplateChanged(): void {}

    /**
     * @internal
     */
    public slottedRowElements: HTMLElement[];

    /**
     * @internal
     */
    public slottedHeaderElements: HTMLElement[];

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

        this.rowsPlaceholder = document.createComment("");
        this.appendChild(this.rowsPlaceholder);

        this.rowsRepeatBehavior = new RepeatDirective(
            x => x.rowsData,
            x => x.rowItemTemplate,
            { positioning: true }
        ).createBehavior(this.rowsPlaceholder);

        this.$fastController.addBehaviors([this.rowsRepeatBehavior!]);
    }
}
