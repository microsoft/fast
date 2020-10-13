import { html } from "@microsoft/fast-element";
import { DataGridHeaderCell } from "./data-grid-header-cell";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridHeaderCell} component.
 * @public
 */
export const DataGridHeaderCellTemplate = html<DataGridHeaderCell>`
    <template role="columnheader">
        <slot part="cellSlot"></slot>
    </template>
`;
