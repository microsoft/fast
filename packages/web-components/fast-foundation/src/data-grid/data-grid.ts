import {
    attr,
    DOM,
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
    keyCodePageDown,
    keyCodePageUp,
} from "@microsoft/fast-web-utilities";
import { DataGridCell } from "./data-grid-cell";
import { DataGridHeaderCell } from "./data-grid-header-cell";
import { DataGridHeader } from "./data-grid-header";
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
     * The width of the column in a form compatible with css grid column widths
     * (i.e. "50px", "1fr", "20%", etc...), defaults to "1fr"
     */
    columnWidth?: string;

    /**
     *  Column title, if not provided columnDataKey is used as title
     */
    title?: string;

    /**
     *  header cell template
     */
    headerCellTemplate?: ViewTemplate;

    /**
     * Whether the header cell has an internal focus queue
     */
    headerCellInternalFocusQueue?: boolean;

    /**
     * Callback function that returns the element to focus in a custom cell.
     * When headerCellInternalFocusQueue is false this function is called when the cell is first focused
     * to immediately move focus to a cell element, for example a cell that is a checkbox could move
     * focus directly to the checkbox.
     * When headerCellInternalFocusQueue is true this function is called when the user hits Enter or F2
     */
    headerCellFocusTargetCallback?: (cell: DataGridHeaderCell) => HTMLElement;

    /**
     * cell template
     */
    cellTemplate?: ViewTemplate;

    /**
     * Whether the cell has an internal focus queue
     */
    cellInternalFocusQueue?: boolean;

    /**
     * Callback function that returns the element to focus in a custom cell.
     * When cellInternalFocusQueue is false this function is called when the cell is first focused
     * to immediately move focus to a cell element, for example a cell that is a checkbox could move
     * focus directly to the checkbox.
     * When cellInternalFocusQueue is true this function is called when the user hits Enter or F2
     */

    cellFocusTargetCallback?: (cell: DataGridCell) => HTMLElement;
}

const defaultRowItemTemplate = html`
    <fast-data-grid-row
        :gridTemplateColumns="${(x, c) => c.parent.gridTemplateColumns}"
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
                columnWidth: "1fr",
            });
        });
        return definitions;
    };

    /**
     *  generates a gridTemplateColumns based on columndata array
     */
    public static generateTemplateColumns(columnsData: DataGridColumn[]): string {
        let templateColumns: string = "";
        columnsData.forEach((column: DataGridColumn) => {
            templateColumns = `${templateColumns}${templateColumns === "" ? "" : " "}${
                column.columnWidth === undefined ? "1fr" : column.columnWidth
            }`;
        });
        return templateColumns;
    }

    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: generate-header
     */
    @attr({ attribute: "generate-header", mode: "boolean" })
    public generateHeader: boolean = true;
    private generateHeaderChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.toggleGeneratedHeader();
        }
    }

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
    public columnsData: DataGridColumn[] = [];
    private columnsDataChanged(): void {
        this.gridTemplateColumns = DataGrid.generateTemplateColumns(this.columnsData);
        if ((this as FASTElement).$fastController.isConnected) {
            if (this.generatedHeader !== null) {
                this.generatedHeader.columnsData = this.columnsData;
            }
        }
    }

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
    private focusRowIndexChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }

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
    private focusColumnIndexChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.queueFocusUpdate();
        }
    }

    /**
     * String that gets applied to the the css gridTemplateColumns attribute of generated rows
     *
     * @internal
     */
    @observable
    public gridTemplateColumns: string;
    private gridTemplateColumnsChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            if (this.generatedHeader !== null) {
                this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns;
            }
        }
    }

    /**
     * @internal
     */
    public slottedRowElements: HTMLElement[];

    /**
     * @internal
     */
    public slottedHeaderElements: HTMLElement[];

    private rowsRepeatBehavior: RepeatBehavior | null;
    private rowsPlaceholder: Node | null = null;

    private generatedHeader: DataGridHeader | null = null;

    private isUpdatingFocus: boolean = false;
    private pendingFocusUpdate: boolean = false;

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

        this.toggleGeneratedHeader();

        this.rowsRepeatBehavior = new RepeatDirective(
            x => x.rowsData,
            x => x.rowItemTemplate,
            { positioning: true }
        ).createBehavior(this.rowsPlaceholder);

        this.$fastController.addBehaviors([this.rowsRepeatBehavior!]);

        this.addEventListener("row-focused", this.handleRowFocus);
        this.addEventListener("focus", this.handleFocus);
        this.addEventListener("keydown", this.handleKeydown);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("row-focused", this.handleRowFocus);
        this.removeEventListener("focus", this.handleFocus);
        this.removeEventListener("keydown", this.handleKeydown);

        this.rowsPlaceholder = null;
        this.generatedHeader = null;
    }

    public handleRowFocus(e: Event): void {
        this.isUpdatingFocus = true;
        const focusRow: DataGridRow = e.target as DataGridRow;
        const rows: Element[] = Array.from(this.querySelectorAll('[role="row"]'));
        this.focusRowIndex = rows.indexOf(e.target as Element);
        this.focusColumnIndex = focusRow.focusColumnIndex;
        this.isUpdatingFocus = false;
    }

    public handleFocus(e: FocusEvent): void {
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex);
    }

    public handleKeydown(e: KeyboardEvent): void {
        if (e.defaultPrevented) {
            return;
        }
        switch (e.keyCode) {
            case keyCodeArrowUp:
                // focus up one row
                this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex);
                e.preventDefault();
                break;

            case keyCodeArrowDown:
                // focus down one row
                this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex);
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
                    this.focusOnCell(0, 0);
                    e.preventDefault();
                }
                break;
            case keyCodeEnd:
                if (e.ctrlKey) {
                    // focus last cell of last row
                    const rows: NodeListOf<Element> = this.querySelectorAll(
                        '[role="row"]'
                    );
                    this.focusOnCell(rows.length - 1, this.columnsData?.length - 1, rows);
                    e.preventDefault();
                }
                break;
        }
    }

    private focusOnCell = (
        rowIndex: number,
        columnIndex: number,
        rows?: NodeListOf<Element>
    ): void => {
        if (rows === undefined) {
            rows = this.querySelectorAll('[role="row"]');
        }

        if (rows.length === 0 || this.columnsData.length === 0) {
            this.focusRowIndex = 0;
            this.focusColumnIndex = 0;
            return;
        }

        let focusRowIndex = Math.max(0, Math.min(rows.length - 1, rowIndex));
        const focusRow: Element = rows[focusRowIndex];

        const cells: NodeListOf<Element> = focusRow.querySelectorAll(
            '[role="cell"], [role="gridcell"], [role="columnheader"]'
        );

        let focusColumnIndex = Math.max(0, Math.min(cells.length - 1, columnIndex));

        (cells[focusColumnIndex] as HTMLElement).focus();
    };

    private queueFocusUpdate(): void {
        if (
            this.isUpdatingFocus &&
            (this.contains(document.activeElement) || this === document.activeElement)
        ) {
            return;
        }
        if (this.pendingFocusUpdate === false) {
            this.pendingFocusUpdate = true;
            DOM.queueUpdate(this.updateFocus);
        }
    }

    private updateFocus(): void {
        this.pendingFocusUpdate = false;
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex);
    }

    private toggleGeneratedHeader(): void {
        if (this.generateHeader && this.generatedHeader === null) {
            const generatedHeaderElement: HTMLElement = document.createElement(
                "fast-data-grid-header"
            );
            this.generatedHeader = (generatedHeaderElement as unknown) as DataGridHeader;
            this.generatedHeader.columnsData = this.columnsData;
            this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns;
            if (this.firstChild !== null || this.rowsPlaceholder !== null) {
                this.insertBefore(
                    generatedHeaderElement,
                    this.firstChild !== null ? this.firstChild : this.rowsPlaceholder
                );
            }
            return;
        }

        if (!this.generateHeader && this.generatedHeader !== null) {
            this.removeChild(this.generatedHeader);
            this.generatedHeader === null;
        }
    }
}
