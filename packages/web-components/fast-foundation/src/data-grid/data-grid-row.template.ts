import { html, slotted, ViewTemplate } from "@microsoft/fast-element";
import { DataGridRow } from "./data-grid-row";

const defaultCellItemTemplate: ViewTemplate = html`
    <fast-data-grid-cell
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></fast-data-grid-cell>
`;

const defaultHeaderCellItemTemplate: ViewTemplate = html`
    <fast-data-grid-cell
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${x => x}"
    ></fast-data-grid-header-cell>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridRow} component.
 * @public
 */
export const DataGridRowTemplate = html<DataGridRow>`
    <template
        :defaultCellItemTemplate=${defaultCellItemTemplate}
        :defaultHeaderCellItemTemplate=${defaultHeaderCellItemTemplate}
        role="row"
        class="${x => (x.rowType !== "default" ? x.rowType : "")}"
    >
        <slot part="cellsSlot" ${slotted("slottedCellElements")}></slot>
    </template>
`;
