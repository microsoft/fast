import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGridRows } from "./data-grid-rows";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridRows} component.
 * @public
 */
export const DataGridRowsTemplate = html<DataGridRows>`
    <template>
        <slot></slot>
    </template>
`;
