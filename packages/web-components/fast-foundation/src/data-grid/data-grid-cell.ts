import {
    attr,
    FASTElement,
    observable,
    html,
    HTMLView,
    ViewTemplate,
} from "@microsoft/fast-element";
import {
    keyCodeEnter,
    keyCodeEscape,
    keyCodeFunction2,
} from "@microsoft/fast-web-utilities";
import { DataGridColumn } from "./data-grid";

const defaultCellContentsTemplate: ViewTemplate = html<DataGridCell>`
    <template>
        ${x =>
            x.rowData === null ||
            x.columnData === null ||
            x.columnData.columnDataKey === null
                ? null
                : x.rowData[x.columnData.columnDataKey]}
    </template>
`;

const defaultHeaderCellContentsTemplate: ViewTemplate = html<DataGridCell>`
    <template>
        ${x =>
            x.columnData === null
                ? null
                : x.columnData.title === undefined
                ? x.columnData.columnDataKey
                : x.columnData.title}
    </template>
`;

/**
 * Types of cells
 *
 * @public
 */
export enum cellType {
    default = "default",
    columnHeader = "column-header",
}

/**
 * A Data Grid Cell Custom HTML Element.
 *
 * @public
 */
export class DataGridCell extends FASTElement {
    /**
     * The type of cell
     *
     * @public
     * @remarks
     * HTML Attribute: cell-type
     */
    @attr({ attribute: "cell-type" })
    public cellType: cellType = cellType.default;
    private cellTypeChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
        }
    }

    /**
     * The base data for the parent row
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
     * The base data for the column
     *
     * @public
     */
    @observable
    public columnData: DataGridColumn | null = null;
    private columnDataChanged(
        oldValue: DataGridColumn | null,
        newValue: DataGridColumn | null
    ): void {
        if ((this as FASTElement).$fastController.isConnected) {
            if (newValue === null) {
                this.disconnectCellView();
                return;
            }

            if (oldValue === null) {
                this.updateCellView();
                return;
            }

            if (oldValue.cellTemplate !== newValue.cellTemplate) {
                this.updateCellView();
            }
        }
    }

    /**
     * If this cell currently has focus
     *
     * @public
     */
    @observable
    public isActiveCell: boolean = false;

    private customCellView: HTMLView | null = null;
    private isInternalFocused: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener("focusin", this.handleFocusin);
        this.addEventListener("focusout", this.handleFocusout);
        this.addEventListener("keydown", this.handleKeydown);

        this.style.gridColumn = `${
            this.columnData?.gridColumn === undefined ? 0 : this.columnData.gridColumn
        }`;

        this.updateCellView();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("focusin", this.handleFocusin);
        this.removeEventListener("focusout", this.handleFocusout);
        this.removeEventListener("keydown", this.handleKeydown);

        this.disconnectCellView();
    }

    public handleFocusin(e: FocusEvent): void {
        if (this.isActiveCell || this.columnData === null) {
            return;
        }

        this.isActiveCell = true;

        switch (this.cellType) {
            case cellType.default:
                if (
                    this.columnData.cellInternalFocusQueue !== true &&
                    typeof this.columnData.cellFocusTargetCallback === "function"
                ) {
                    // move focus to the focus target
                    const focusTarget: HTMLElement = this.columnData.cellFocusTargetCallback(
                        this
                    );
                    if (focusTarget !== null) {
                        focusTarget.focus();
                    }
                }
                break;

            case cellType.columnHeader:
                if (
                    this.columnData.headerCellInternalFocusQueue !== true &&
                    typeof this.columnData.headerCellFocusTargetCallback === "function"
                ) {
                    // move focus to the focus target
                    const focusTarget: HTMLElement = this.columnData.headerCellFocusTargetCallback(
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
            this.isInternalFocused = false;
        }
    }

    public handleKeydown(e: KeyboardEvent): void {
        if (
            e.defaultPrevented ||
            this.columnData === null ||
            (this.cellType === cellType.default &&
                this.columnData.cellInternalFocusQueue !== true) ||
            (this.cellType === cellType.columnHeader &&
                this.columnData.headerCellInternalFocusQueue !== true)
        ) {
            return;
        }

        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeFunction2:
                if (this.isInternalFocused || this.columnData === undefined) {
                    return;
                }

                switch (this.cellType) {
                    case cellType.default:
                        if (this.columnData.cellFocusTargetCallback !== undefined) {
                            const focusTarget: HTMLElement = this.columnData.cellFocusTargetCallback(
                                this
                            );
                            if (focusTarget !== null) {
                                this.isInternalFocused = true;
                                focusTarget.focus();
                            }
                            e.preventDefault();
                        }
                        break;

                    case cellType.columnHeader:
                        if (this.columnData.headerCellFocusTargetCallback !== undefined) {
                            const focusTarget: HTMLElement = this.columnData.headerCellFocusTargetCallback(
                                this
                            );
                            if (focusTarget !== null) {
                                this.isInternalFocused = true;
                                focusTarget.focus();
                            }
                            e.preventDefault();
                        }
                        break;
                }
                break;

            case keyCodeEscape:
                if (this.isInternalFocused) {
                    this.focus();
                    this.isInternalFocused = false;
                    e.preventDefault();
                }
                break;
        }
    }

    private updateCellView(): void {
        this.disconnectCellView();

        if (this.columnData === null) {
            return;
        }

        switch (this.cellType) {
            case cellType.default:
                if (this.columnData.cellTemplate !== undefined) {
                    this.customCellView = this.columnData.cellTemplate.render(this, this);
                } else {
                    this.customCellView = defaultCellContentsTemplate.render(this, this);
                }
                break;

            case cellType.columnHeader:
                if (this.columnData.headerCellTemplate !== undefined) {
                    this.customCellView = this.columnData.headerCellTemplate.render(
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
        }
    }

    private disconnectCellView(): void {
        if (this.customCellView !== null) {
            this.customCellView.unbind();
            this.customCellView = null;
        }
    }
}
