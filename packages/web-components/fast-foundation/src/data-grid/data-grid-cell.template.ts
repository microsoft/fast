import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGridCell } from "./data-grid-cell";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridCell} component.
 * @public
 */
export const DataGridCellTemplate = html<DataGridCell>`
    <template
        tabindex="-1"
        role="${x => (x.cellType === "columnheader" ? "columnheader" : "gridcell")}"
        class="${x => (x.cellType === "columnheader" ? "column-header" : "")}"
    >
        <slot part="cellSlot"></slot>
    </template>
`;
