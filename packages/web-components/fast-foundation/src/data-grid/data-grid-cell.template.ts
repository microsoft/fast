import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGridCell } from "./data-grid-cell";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridCell} component.
 * @public
 */
export const DataGridCellTemplate = html<DataGridCell>`
    <template tabindex="-1">
        <slot part="cellSlot"></slot>
    </template>
`;
