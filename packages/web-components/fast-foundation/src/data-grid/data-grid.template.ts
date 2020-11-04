import { html, slotted, when } from "@microsoft/fast-element";
import { DataGrid } from "./data-grid";

const defaultRowItemTemplate = html`
    <fast-data-grid-row
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></fast-data-grid-row>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#DataGrid} component.
 * @public
 */
export const DataGridTemplate = html<DataGrid>`
    <template role="grid" tabindex="0" :defaultRowItemTemplate=${defaultRowItemTemplate}>
        <slot></slot>
    </template>
`;
