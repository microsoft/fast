import {
    attr,
    FASTElement,
    observable,
    html,
    HTMLView,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DataGridColumn } from "./data-grid";

const defaultHeaderCellContentsTemplate: ViewTemplate = html<DataGridHeaderCell>`
    <template>
        ${x =>
            x.columnData.title === undefined
                ? x.columnData.columnDataKey
                : x.columnData.title}
    </template>
`;

/**
 * A Data Grid Cell Custom HTML Element.
 *
 * @public
 */
export class DataGridHeaderCell extends FASTElement {
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

    private customCellView: HTMLView | null = null;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.style.gridColumn = `${
            this.gridColumnIndex === undefined ? 0 : this.gridColumnIndex
        }`;

        if (this.columnData?.headerCellTemplate !== undefined) {
            this.customCellView = this.columnData.headerCellTemplate.render(this, this);
        } else {
            this.customCellView = defaultHeaderCellContentsTemplate.render(this, this);
        }
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        if (this.customCellView !== null) {
            this.customCellView.unbind();
            this.customCellView = null;
        }
    }
}
