import {
    attr,
    FASTElement,
    html,
    RepeatBehavior,
    RepeatDirective,
    observable,
    ViewTemplate,
} from "@microsoft/fast-element";
import {
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    keyCodePageUp,
    keyCodePageDown,
} from "@microsoft/fast-web-utilities";
import { DataGridRow } from "./data-grid-row";

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
     * The index of the row that will receive focus the next time the
     * grid is focused. This value changes as focus moves to different
     * rows within the grid.  Changing this value when focus is already
     * within the grid moves focus to the specified row.
     *
     * @public
     */
    @observable
    public focusRowIndex: number = 0;
    private focusRowIndexChanged(): void {}

    /**
     * The index of the column that will receive focus the next time the
     * grid is focused. This value changes as focus moves to different rows
     * within the grid.  Changing this value when focus is already within
     * the grid moves focus to the specified column.
     *
     * @public
     */
    @observable
    public focusColumnIndex: number = 0;
    private focusColumnIndexChanged(): void {}

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

    private rowElementTag: string = "fast-data-grid-row";
    private cellElementTag: string = "fast-data-grid-cell";

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

        this.addEventListener("row-focused", this.handleRowFocus);
        this.addEventListener("focusin", this.handleFocusin);
        this.addEventListener("keydown", this.handleKeydown);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("row-focused", this.handleRowFocus);
        this.removeEventListener("focusin", this.handleFocusin);
        this.removeEventListener("keydown", this.handleKeydown);
    }

    public handleRowFocus(e: Event): void {
        const focusRow: DataGridRow = e.target as DataGridRow;
        this.focusColumnIndex = focusRow.focusColumnIndex;
        const rows: Element[] = Array.from(this.querySelectorAll(this.rowElementTag));
        this.focusRowIndex = rows.indexOf(e.target as Element);
    }

    public handleFocusin = (e: FocusEvent): void => {
        const rows: NodeListOf<Element> = this.querySelectorAll(this.rowElementTag);

        if (rows.length === 0) {
            this.focusRowIndex = 0;
            return;
        }

        if (e.target === this) {
            // focus on an internal cell

            this.focusRowIndex = Math.min(rows.length - 1, this.focusRowIndex);
            const focusRow: Element = rows[this.focusRowIndex];

            const cells: NodeListOf<Element> = focusRow.querySelectorAll(
                this.cellElementTag
            );
            this.focusColumnIndex = Math.min(cells.length - 1, this.focusColumnIndex);

            (cells[this.focusColumnIndex] as HTMLElement).focus();
            return;
        }
    };

    public handleKeydown(e: KeyboardEvent): void {
        if (e.defaultPrevented) {
            return;
        }
        switch (e.keyCode) {
            case keyCodeArrowUp:
                // focus up one row
                e.preventDefault();
                break;

            case keyCodeArrowDown:
                // focus down one row
                e.preventDefault();
                break;

            case keyCodePageUp:
                // focus up one "page"
                e.preventDefault();
                break;

            case keyCodePageDown:
                // focus down one "page"
                e.preventDefault();
                break;

            case keyCodeHome:
                if (e.ctrlKey) {
                    // focus first cell of first row
                    e.preventDefault();
                }
                break;
            case keyCodeEnd:
                if (e.ctrlKey) {
                    // focus last cell of last row
                    e.preventDefault();
                }
                break;
        }
    }
}
