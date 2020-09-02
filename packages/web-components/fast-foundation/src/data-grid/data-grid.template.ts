import { html, ref, slotted } from "@microsoft/fast-element";
import { DataGrid } from "./data-grid";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGrid} component.
 * @public
 */
export const DataGridTemplate = html<DataGrid>`
    <template role="grid">
      <slot name="headerSlot" part="headerSlot" ${slotted("slottedHeaderElements")}></slot>
      <slot part="rowsSlot" ${slotted("slottedRowElements")}></slot>
    </template>
`;