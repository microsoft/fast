import { attr, observable, RepeatOptions, ViewTemplate } from "@microsoft/fast-element";
import {
    eventFocusOut,
    eventKeyDown,
    keyArrowLeft,
    keyArrowRight,
    keyEnd,
    keyHome,
    Orientation,
} from "@microsoft/fast-web-utilities";
import { FASTDataList } from "../data-list/index.js";
import type { ColumnDefinition } from "./data-grid.js";
import { DataGridRowTypes } from "./data-grid.options.js";

/**
 * A Data Grid Row Custom HTML Element.
 *
 * @fires row-focused - Fires a custom 'row-focused' event when focus is on an element (usually a cell or its contents) in the row
 * @slot - The default slot for custom cell elements
 * @public
 */
export class FASTDataGridRow extends FASTDataList {
    // data grid rows have horizontal orientation
    public orientation: Orientation = Orientation.horizontal;

    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the row
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    @attr({ attribute: "grid-template-columns" })
    public gridTemplateColumns: string;
    protected gridTemplateColumnsChanged(): void {
        if (this.$fastController.isConnected) {
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
        if (this.$fastController.isConnected) {
            this.updateItemTemplate();
        }
    }

    /**
     * The base data for this row
     *
     * @public
     */
    @observable
    public rowData: object | null = null;
    protected rowDataChanged(): void {
        if (this.rowData !== null && this.isActiveRow) {
            this.refocusOnLoad = true;
            return;
        }
    }

    /**
     * The column definitions of the row
     *
     * @public
     */
    @observable
    public columnDefinitions: ColumnDefinition[];
    private columnDefinitionsChanged(): void {
        this.sourceItems = this.columnDefinitions;
    }

    /**
     * The template used to render cells in generated rows.
     *
     * @public
     */
    @observable
    public cellItemTemplate?: ViewTemplate;
    private cellItemTemplateChanged(): void {
        this.updateItemTemplate();
    }

    /**
     * The template used to render header cells in generated rows.
     *
     * @public
     */
    @observable
    public headerCellItemTemplate?: ViewTemplate;
    private headerCellItemTemplateChanged(): void {
        this.updateItemTemplate();
    }

    /**
     * The index of the row in the parent grid.
     * This is typically set programmatically by the parent grid.
     *
     * @public
     */
    @observable
    public rowIndex: number;

    /**
     * Whether focus is on/in a cell within this row.
     *
     * @internal
     */
    @observable
    public isActiveRow: boolean = false;

    /**
     * The cell item template currently in use.
     *
     * @internal
     */
    @observable
    public activeCellItemTemplate?: ViewTemplate;

    /**
     * The default cell item template.  Set by the component templates.
     *
     * @internal
     */
    @observable
    public defaultCellItemTemplate?: ViewTemplate;

    /**
     * The default header cell item template.  Set by the component templates.
     *
     * @internal
     */
    @observable
    public defaultHeaderCellItemTemplate?: ViewTemplate;

    /**
     * Children that are cells
     *
     * @internal
     */
    @observable
    public cellElements: HTMLElement[];

    /**
     * @internal
     */
    public slottedCellElements: HTMLElement[];

    /**
     * @internal
     */
    public focusColumnIndex: number = 0;

    private refocusOnLoad: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener("cell-focused", this.handleCellFocus);
        this.addEventListener(eventFocusOut, this.handleFocusout);
        this.addEventListener(eventKeyDown, this.handleKeydown);

        this.updateRowStyle();

        if (this.refocusOnLoad) {
            // if focus was on the row when data changed try to refocus on same cell
            this.refocusOnLoad = false;
            if (this.cellElements.length > this.focusColumnIndex) {
                (this.cellElements[this.focusColumnIndex] as HTMLElement).focus();
            }
        }
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("cell-focused", this.handleCellFocus);
        this.removeEventListener(eventFocusOut, this.handleFocusout);
        this.removeEventListener(eventKeyDown, this.handleKeydown);
    }

    public handleFocusout(e: FocusEvent): void {
        if (!this.contains(e.target as Element)) {
            this.isActiveRow = false;
            this.focusColumnIndex = 0;
        }
    }

    public handleCellFocus(e: Event): void {
        this.isActiveRow = true;
        this.focusColumnIndex = this.cellElements.indexOf(e.target as HTMLElement);
        this.$emit("row-focused", this);
    }

    public handleKeydown(e: KeyboardEvent): void {
        if (e.defaultPrevented) {
            return;
        }
        let newFocusColumnIndex: number = 0;
        switch (e.key) {
            case keyArrowLeft:
                // focus left one cell
                newFocusColumnIndex = Math.max(0, this.focusColumnIndex - 1);
                (this.cellElements[newFocusColumnIndex] as HTMLElement).focus();
                e.preventDefault();
                break;

            case keyArrowRight:
                // focus right one cell
                newFocusColumnIndex = Math.min(
                    this.cellElements.length - 1,
                    this.focusColumnIndex + 1
                );
                (this.cellElements[newFocusColumnIndex] as HTMLElement).focus();
                e.preventDefault();
                break;

            case keyHome:
                if (!e.ctrlKey) {
                    (this.cellElements[0] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
            case keyEnd:
                if (!e.ctrlKey) {
                    // focus last cell of the row
                    (this.cellElements[
                        this.cellElements.length - 1
                    ] as HTMLElement).focus();
                    e.preventDefault();
                }
                break;
        }
    }

    protected updateItemTemplate(): void {
        this.activeCellItemTemplate =
            this.rowType === DataGridRowTypes.default &&
            this.cellItemTemplate !== undefined
                ? this.cellItemTemplate
                : this.rowType === DataGridRowTypes.default &&
                  this.cellItemTemplate === undefined
                ? this.defaultCellItemTemplate
                : this.headerCellItemTemplate !== undefined
                ? this.headerCellItemTemplate
                : this.defaultHeaderCellItemTemplate;

        if (this.activeCellItemTemplate) {
            this.itemTemplate = this.activeCellItemTemplate;
        }
    }

    protected getRepeatOptions(): RepeatOptions {
        // positioning is always true for data grid rows
        return {
            positioning: true,
            recycle: this.recycle,
        };
    }

    private updateRowStyle = (): void => {
        this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
}
