import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGrid } from "./data-grid";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGrid} component.
 * @public
 */
export const DataGridTemplate = html<DataGrid>`
    <template role="grid">
    <slot
        ${slotted({ property: "rowElements", filter: elements("fast-data-grid-row") })}
    ></slot>
    </template>
`;
