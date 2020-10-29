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
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";
import { ColumnDefinition } from "./data-grid";

const defaultCellItemTemplate = html`
    <fast-data-grid-cell
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></fast-data-grid-cell>
`;

const headerCellItemTemplate = html`
    <fast-data-grid-cell
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${x => x}"
    ></fast-data-grid-header-cell>
`;

/**
 * Enumerates possible row types
 *
 * @public
 */
export enum DataGridRowTypes {
    default = "default",
    header = "header",
    stickyHeader = "sticky-header",
}

/**
 * A Data Grid Row Custom HTML Element.
 *
 * @public
 */
export class DataGridRow extends FASTElement {
    private static cellQueryString =
        '[role="cell"], [role="gridcell"], [role="columnheader"]';

    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the row
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    @attr({ attribute: "grid-template-columns" })
    public gridTemplateColumns: string;
    private gridTemplateColumnsChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.updateRowStyle();
        }
    }

    /**
     * The type of row
     *
     * @public
     * @remarks
     * HTML Attribute: row-type
     */
    @attr({ attribute: "row-type" })
    public rowType: DataGridRowTypes = DataGridRowTypes.default;
    private rowTypeChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
        }
    }

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
    public columnDefinitions: ColumnDefinition[] | null = null;
    private columnDefinitionsChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
        }
    }

    /**
     * The template used to render programmatically generated cells.
     *
     * @public
     */
    @observable
    public cellItemTemplate?: ViewTemplate | undefined;
    private cellItemTemplateChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
        }
    }

    /**
     * The index of the row in the parent grid.
     * This is typically set programmatically by the parent grid.
     *
     * @public
     */
    @observable
    public rowIndex: number;
    private rowIndexChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
        }
    }

    /**
     * Whether focus is on/in a cell within this row.
     *
     * @internal
     */
    @observable
    public isActiveRow: boolean = false;

    private cellsRepeatBehavior: RepeatBehavior | null = null;
    private cellsPlaceholder: Node | null = null;

    /**
     * @internal
     */
    public slottedCellElements: HTMLElement[];

    /**
     * @internal
     */
    public focusColumnIndex: number = 0;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        // note that row elements can be reused with a different data object
        // as the parent grid's repeat behavior reacts to changes in the data set.
        if (this.cellsRepeatBehavior === null) {
            this.cellsPlaceholder = document.createComment("");
            this.appendChild(this.cellsPlaceholder);

            this.cellItemTemplate =
                this.rowType === DataGridRowTypes.default
                    ? defaultCellItemTemplate
                    : headerCellItemTemplate;

            this.cellsRepeatBehavior = new RepeatDirective(
                x => x.columnDefinitions,
                x => x.cellItemTemplate,
                { positioning: true }
            ).createBehavior(this.cellsPlaceholder);

            this.$fastController.addBehaviors([this.cellsRepeatBehavior!]);
        }

        this.addEventListener("cell-focused", this.handleCellFocus);
        this.addEventListener("focusout", this.handleFocusout);
        this.addEventListener("keydown", this.handleKeydown);

        this.updateRowStyle();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("cell-focused", this.handleCellFocus);
        this.removeEventListener("focusout", this.handleFocusout);
        this.removeEventListener("keydown", this.handleKeydown);
    }

    public handleFocusout(e: FocusEvent): void {
        if (!this.contains(e.target as Element)) {
            this.isActiveRow = false;
            this.focusColumnIndex = 0;
        }
    }

    public handleCellFocus(e: Event): void {
        this.isActiveRow = true;
        const cells: Element[] = Array.from(
            this.querySelectorAll(DataGridRow.cellQueryString)
        );
        this.focusColumnIndex = cells.indexOf(e.target as Element);
        this.$emit("row-focused", this);
    }

    public handleKeydown(e: KeyboardEvent): void {
        if (e.defaultPrevented) {
            return;
        }
        let cells: Element[] = [];
        let newFocusColumnIndex: number = 0;
        switch (e.keyCode) {
            case keyCodeArrowLeft:
                // focus left one cell
                cells = Array.from(this.querySelectorAll(DataGridRow.cellQueryString));
                newFocusColumnIndex = Math.max(0, this.focusColumnIndex - 1);
                (cells[newFocusColumnIndex] as HTMLElement).focus();
                e.preventDefault();
                break;

            case keyCodeArrowRight:
                // focus right one cell
                cells = Array.from(this.querySelectorAll(DataGridRow.cellQueryString));
                newFocusColumnIndex = Math.min(
                    cells.length - 1,
                    this.focusColumnIndex + 1
                );
                (cells[newFocusColumnIndex] as HTMLElement).focus();
                e.preventDefault();
                break;

            case keyCodeHome:
                if (!e.ctrlKey) {
                    // focus first cell of the row
                    cells = Array.from(
                        this.querySelectorAll(DataGridRow.cellQueryString)
                    );
                    (cells[0] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
            case keyCodeEnd:
                if (!e.ctrlKey) {
                    // focus last cell of the row
                    cells = Array.from(
                        this.querySelectorAll(DataGridRow.cellQueryString)
                    );
                    (cells[cells.length - 1] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
        }
    }

    private updateRowStyle = (): void => {
        this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
}
