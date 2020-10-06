import {
    attr,
    DOM,
    FASTElement,
    observable,
    html,
    HTMLView,
    ViewTemplate,
} from "@microsoft/fast-element";
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
    public columnData: DataGridColumn | null = null;
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

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener("focusin", this.handleFocusin);
        this.addEventListener("focusout", this.handleFocusout);

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

        if (this.customCellView !== null) {
            this.customCellView.unbind();
            this.customCellView = null;
        }
    }

    public handleFocusin(e: FocusEvent): void {
        if (this.isActiveCell) {
            return;
        }
        this.isActiveCell = true;

        this.$emit("cell-focused", this);
    }

    public handleFocusout(e: FocusEvent): void {
        this.isActiveCell = false;
    }
}
