import { html, slotted } from "@microsoft/fast-element";
import { DataGridHeader } from "./data-grid-header";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridRows} component.
 * @public
 */
export const DataGridHeaderTemplate = html<DataGridHeader>`
    <template role="row">
        <slot part="cellsSlot" ${slotted("slottedCellElements")}></slot>
    </template>
`;
