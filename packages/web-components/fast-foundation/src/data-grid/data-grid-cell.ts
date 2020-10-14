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

/**
 * A Data Grid Cell Custom HTML Element.
 *
 * @public
 */
export class DataGridCell extends FASTElement {
    /**
     * The column index
     *
     * @public
     * @remarks
     * HTML Attribute: grid-ccolumn-index
     */
    @attr
    public gridColumnIndex: number;
    private columnIndexChanged(): void {}

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
    public columnData: DataGridColumn;
    private columnDataChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
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
            this.gridColumnIndex === undefined ? 0 : this.gridColumnIndex
        }`;

        if (this.columnData?.cellTemplate !== undefined) {
            this.customCellView = this.columnData.cellTemplate.render(this, this);
        } else {
            this.customCellView = defaultCellContentsTemplate.render(this, this);
        }
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener("focusin", this.handleFocusin);
        this.removeEventListener("focusout", this.handleFocusout);
        this.removeEventListener("keydown", this.handleKeydown);

        if (this.customCellView !== null) {
            this.customCellView.unbind();
            this.customCellView = null;
        }
    }

    public handleFocusin(e: FocusEvent): void {
        if (this.isActiveCell || this.columnData === null) {
            return;
        }

        this.isActiveCell = true;

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
            this.columnData === undefined ||
            this.columnData.cellInternalFocusQueue !== true
        ) {
            return;
        }

        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeFunction2:
                if (
                    !this.isInternalFocused &&
                    this.columnData !== undefined &&
                    this.columnData.cellFocusTargetCallback !== undefined
                ) {
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

            case keyCodeEscape:
                if (this.isInternalFocused) {
                    this.focus();
                    this.isInternalFocused = false;
                    e.preventDefault();
                }
                break;
        }
    }
}
