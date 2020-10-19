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
    <fast-data-grid-header-cell
        gridColumnIndex="${(x, c) => c.index + 1}"
        :columnData="${x => x}"
    ></fast-data-grid-header-cell>
`;

/**
 * A Data Grid header Custom HTML Element.
 *
 * @public
 */
export class DataGridHeader extends FASTElement {
    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the header
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    @attr({ attribute: "grid-template-columns" })
    public gridTemplateColumns: string;
    private gridTemplateColumnsChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.updateHeaderStyle();
        }
    }

    /**
     * The index of the row in the parent grid, generally set programmatically by the
     * parent grid
     *
     * @public
     * @remarks
     * HTML Attribute: row-index
     */
    @attr({ attribute: "row-index" })
    public rowIndex: number;
    private rowIndexChanged(): void {
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
    private columnsDataChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
        }
    }

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
     * If this row currently has focus
     *
     * @public
     */
    @observable
    public isActiveRow: boolean = false;

    public focusColumnIndex: number = 0;

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

        this.updateHeaderStyle();
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
            this.querySelectorAll('[role="columnheader"]')
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
                cells = Array.from(this.querySelectorAll('[role="columnheader"]'));
                newFocusColumnIndex = Math.max(0, this.focusColumnIndex - 1);
                (cells[newFocusColumnIndex] as HTMLElement).focus();
                e.preventDefault();
                break;

            case keyCodeArrowRight:
                // focus right one cell
                cells = Array.from(this.querySelectorAll('[role="columnheader"]'));
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
                    cells = Array.from(this.querySelectorAll('[role="columnheader"]'));
                    (cells[0] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
            case keyCodeEnd:
                if (!e.ctrlKey) {
                    // focus last cell of the row
                    cells = Array.from(this.querySelectorAll('[role="columnheader"]'));
                    (cells[cells.length - 1] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
        }
    }

    private updateHeaderStyle = (): void => {
        this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
}
