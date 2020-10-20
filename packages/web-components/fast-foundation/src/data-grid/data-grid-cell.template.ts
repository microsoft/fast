import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGridCell } from "./data-grid-cell";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridCell} component.
 * @public
 */
export const DataGridCellTemplate = html<DataGridCell>`
    <template
        tabindex="-1"
        role="${x => (x.cellType === "column-header" ? "column-header" : "grid-cell")}"
        class="${x => (x.cellType === "column-header" ? "column-header" : "")}"
    >
        <slot part="cellSlot"></slot>
    </template>
`;
