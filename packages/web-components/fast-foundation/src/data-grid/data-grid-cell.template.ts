import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTDataGridCell } from "./data-grid-cell.js";
import { DataGridCellRole } from "./data-grid.options.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#FASTDataGridCell} component using
 * the provided prefix.
 * @public
 */
export function dataGridCellTemplate<
    T extends FASTDataGridCell
>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            tabindex="-1"
            role="${x => DataGridCellRole[x.cellType] ?? DataGridCellRole.default}"
        >
            <slot></slot>
        </template>
    `;
}
