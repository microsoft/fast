import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { DataGridCell } from "./data-grid-cell";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridCell} component using
 * the provided prefix.
 * @public
 */
export function createDataGridCellTemplate(prefix: string): ViewTemplate {
    return html<DataGridCell>`
        <template
            tabindex="-1"
            role="${x => (x.cellType === "columnheader" ? "columnheader" : "gridcell")}"
            class="${x => (x.cellType === "columnheader" ? "column-header" : "")}"
        >
            <slot></slot>
        </template>
    `;
}
