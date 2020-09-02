import { html, slotted, elements } from "@microsoft/fast-element";
import { DataGridCell } from "./data-grid-cell";

/**
 * The template for the {@link @microsoft/fast-foundation#DataGridCell} component.
 * @public
 */
export const DataGridCellTemplate = html<DataGridCell>`
    <template>
        <button>${x => (x.rowData === null || x.columnData === null || x.columnData.columnDataKey === null) ? "nada" : x.rowData[x.columnData.columnDataKey]}</button>
    </template>
`;
