import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGridRow } from "./data-grid-row";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridRow} component.
 * @public
 */
export const DataGridRowTemplate = html<DataGridRow>`
    <template>
       <slot part="cellsSlot" ${slotted("slottedCellElements")}></slot>
    </template>
`;
