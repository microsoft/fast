import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTDataGridCell } from "./data-grid-cell.js";
import { DataGridCellRole, DataGridCellTypeClass } from "./data-grid.options.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#FASTDataGridCell} component using
 * the provided prefix.
 * @public
 */
export function dataGridCellTemplate(): ElementViewTemplate<FASTDataGridCell> {
    return html<FASTDataGridCell>`
        <template
            tabindex="-1"
            role="${x => DataGridCellRole[x.cellType] ?? DataGridCellRole.default}"
            class="${x => DataGridCellTypeClass[x.cellType] ?? ""}"
        >
            <slot></slot>
        </template>
    `;
}
