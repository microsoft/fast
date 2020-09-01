import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGridCell } from "./data-grid-cell";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridRow} component.
 * @public
 */
export const DataGridCellTemplate = html<DataGridCell>`
    <template>
        "${x => (x.rowData === null || x.columnData === null) ? null : x.rowData[x.columnData.columnDataKey]}"
    </template>
`;
