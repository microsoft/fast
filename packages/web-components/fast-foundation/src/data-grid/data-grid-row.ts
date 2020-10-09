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
     * If this cell currently has focus
     *
     * @public
     */
    @observable
    public isActiveRow: boolean = false;

    public focusColumnIndex: number = -1;

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
        if (!this.contains(e.relatedTarget as Element)) {
            this.isActiveRow = false;
            this.focusColumnIndex = -1;
        }
    }

    public handleCellFocus(e: Event): void {
        this.isActiveRow = true;
        const cells: Element[] = Array.from(this.querySelectorAll('[role="cell"]'));
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
                cells = Array.from(this.querySelectorAll('[role="cell"]'));
                newFocusColumnIndex = Math.max(0, this.focusColumnIndex - 1);
                (cells[newFocusColumnIndex] as HTMLElement).focus();
                e.preventDefault();
                break;

            case keyCodeArrowRight:
                // focus right one cell
                cells = Array.from(this.querySelectorAll('[role="cell"]'));
                newFocusColumnIndex = Math.min(cells.length, this.focusColumnIndex + 1);
                (cells[newFocusColumnIndex] as HTMLElement).focus();
                e.preventDefault();
                break;

            case keyCodeHome:
                if (!e.ctrlKey) {
                    // focus first cell of the row
                    cells = Array.from(this.querySelectorAll('[role="cell"]'));
                    (cells[0] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
            case keyCodeEnd:
                if (!e.ctrlKey) {
                    // focus last cell of the row
                    cells = Array.from(this.querySelectorAll('[role="cell"]'));
                    (cells[cells.length - 1] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
        }
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

    private updateRowStyle = (): void => {
        this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
}
