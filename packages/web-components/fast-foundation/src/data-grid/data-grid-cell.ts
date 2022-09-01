import {
    attr,
    FASTElement,
    html,
    HTMLView,
    observable,
    ViewTemplate,
} from "@microsoft/fast-element";
import {
    eventFocusIn,
    eventFocusOut,
    eventKeyDown,
    keyEnter,
    keyEscape,
    keyFunction2,
} from "@microsoft/fast-web-utilities";
import type { ColumnDefinition } from "./data-grid.js";
import { DataGridCellTypes } from "./data-grid.options.js";

export { DataGridCellTypes };

const defaultCellContentsTemplate: ViewTemplate<FASTDataGridCell> = html`
    <template>
        ${x =>
            x.rowData === null ||
            x.columnDefinition === null ||
            x.columnDefinition.columnDataKey === null
                ? null
                : x.rowData[x.columnDefinition.columnDataKey]}
    </template>
`;

const defaultHeaderCellContentsTemplate: ViewTemplate<FASTDataGridCell> = html`
    <template>
        ${x =>
            x.columnDefinition === null
                ? null
                : x.columnDefinition.title === undefined
                ? x.columnDefinition.columnDataKey
                : x.columnDefinition.title}
    </template>
`;

/**
 * A Data Grid Cell Custom HTML Element.
 *
 * @fires cell-focused - Fires a custom 'cell-focused' event when focus is on the cell or its contents
 * @slot - The default slot for cell contents.  The "cell contents template" renders here.
 * @public
 */
export class FASTDataGridCell extends FASTElement {
    /**
     * The type of cell
     *
     * @public
     * @remarks
     * HTML Attribute: cell-type
     */
    @attr({ attribute: "cell-type" })
    public cellType: DataGridCellTypes = DataGridCellTypes.default;
    private cellTypeChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateCellView();
        }
    }

    /**
     * The column index of the cell.
     * This will be applied to the css grid-column-index value
     * applied to the cell
     *
     * @public
     * @remarks
     * HTML Attribute: grid-column
     */
    @attr({ attribute: "grid-column" })
    public gridColumn: string;
    protected gridColumnChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateCellStyle();
        }
    }

    /**
     * The base data for the parent row
     *
     * @public
     */
    @observable
    public rowData: object | null = null;

    /**
     * The base data for the column
     *
     * @public
     */
    @observable
    public columnDefinition: ColumnDefinition | null = null;
    protected columnDefinitionChanged(
        oldValue: ColumnDefinition | null,
        newValue: ColumnDefinition | null
    ): void {
        if (this.$fastController.isConnected) {
            this.updateCellView();
        }
    }

    private isActiveCell: boolean = false;
    private customCellView: HTMLView | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener(eventFocusIn, this.handleFocusin);
        this.addEventListener(eventFocusOut, this.handleFocusout);
        this.addEventListener(eventKeyDown, this.handleKeydown);

        this.style.gridColumn = `${
            this.columnDefinition?.gridColumn === undefined
                ? 0
                : this.columnDefinition.gridColumn
        }`;

        this.updateCellView();
        this.updateCellStyle();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener(eventFocusIn, this.handleFocusin);
        this.removeEventListener(eventFocusOut, this.handleFocusout);
        this.removeEventListener(eventKeyDown, this.handleKeydown);

        this.disconnectCellView();
    }

    public handleFocusin(e: FocusEvent): void {
        if (this.isActiveCell) {
            return;
        }

        this.isActiveCell = true;

        switch (this.cellType) {
            case DataGridCellTypes.columnHeader:
                if (
                    this.columnDefinition !== null &&
                    this.columnDefinition.headerCellInternalFocusQueue !== true &&
                    typeof this.columnDefinition.headerCellFocusTargetCallback ===
                        "function"
                ) {
                    // move focus to the focus target
                    const focusTarget: HTMLElement = this.columnDefinition.headerCellFocusTargetCallback(
                        this
                    );
                    if (focusTarget !== null) {
                        focusTarget.focus();
                    }
                }
                break;

            default:
                if (
                    this.columnDefinition !== null &&
                    this.columnDefinition.cellInternalFocusQueue !== true &&
                    typeof this.columnDefinition.cellFocusTargetCallback === "function"
                ) {
                    // move focus to the focus target
                    const focusTarget: HTMLElement = this.columnDefinition.cellFocusTargetCallback(
                        this
                    );
                    if (focusTarget !== null) {
                        focusTarget.focus();
                    }
                }
                break;
        }

        this.$emit("cell-focused", this);
    }

    public handleFocusout(e: FocusEvent): void {
        if (this !== document.activeElement && !this.contains(document.activeElement)) {
            this.isActiveCell = false;
        }
    }

    public handleKeydown(e: KeyboardEvent): void {
        if (
            e.defaultPrevented ||
            this.columnDefinition === null ||
            (this.cellType === DataGridCellTypes.default &&
                this.columnDefinition.cellInternalFocusQueue !== true) ||
            (this.cellType === DataGridCellTypes.columnHeader &&
                this.columnDefinition.headerCellInternalFocusQueue !== true)
        ) {
            return;
        }

        switch (e.key) {
            case keyEnter:
            case keyFunction2:
                if (
                    this.contains(document.activeElement) &&
                    document.activeElement !== this
                ) {
                    return;
                }

                switch (this.cellType) {
                    case DataGridCellTypes.columnHeader:
                        if (
                            this.columnDefinition.headerCellFocusTargetCallback !==
                            undefined
                        ) {
                            const focusTarget: HTMLElement = this.columnDefinition.headerCellFocusTargetCallback(
                                this
                            );
                            if (focusTarget !== null) {
                                focusTarget.focus();
                            }
                            e.preventDefault();
                        }
                        break;

                    default:
                        if (this.columnDefinition.cellFocusTargetCallback !== undefined) {
                            const focusTarget: HTMLElement = this.columnDefinition.cellFocusTargetCallback(
                                this
                            );
                            if (focusTarget !== null) {
                                focusTarget.focus();
                            }
                            e.preventDefault();
                        }
                        break;
                }
                break;

            case keyEscape:
                if (
                    this.contains(document.activeElement) &&
                    document.activeElement !== this
                ) {
                    this.focus();
                    e.preventDefault();
                }
                break;
        }
    }

    private updateCellView(): void {
        this.disconnectCellView();

        if (this.columnDefinition === null) {
            return;
        }

        switch (this.cellType) {
            case DataGridCellTypes.columnHeader:
                if (this.columnDefinition.headerCellTemplate !== undefined) {
                    this.customCellView = this.columnDefinition.headerCellTemplate.render(
                        this,
                        this
                    );
                } else {
                    this.customCellView = defaultHeaderCellContentsTemplate.render(
                        this,
                        this
                    );
                }
                break;

            case undefined:
            case DataGridCellTypes.rowHeader:
            case DataGridCellTypes.default:
                if (this.columnDefinition.cellTemplate !== undefined) {
                    this.customCellView = this.columnDefinition.cellTemplate.render(
                        this,
                        this
                    );
                } else {
                    this.customCellView = defaultCellContentsTemplate.render(this, this);
                }
                break;
        }
    }

    private disconnectCellView(): void {
        if (this.customCellView !== null) {
            this.customCellView.dispose();
            this.customCellView = null;
        }
    }

    private updateCellStyle = (): void => {
        this.style.gridColumn = this.gridColumn;
    };
}
