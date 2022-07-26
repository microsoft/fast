import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTDataGridCell } from "./data-grid-cell.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#FASTDataGridCell} component using
 * the provided prefix.
 * @public
 */
export function dataGridCellTemplate(): ElementViewTemplate<FASTDataGridCell> {
    return html<FASTDataGridCell>`
        <template
            tabindex="-1"
            role="${x =>
                !x.cellType || x.cellType === "default" ? "gridcell" : x.cellType}"
            :classList="
            ${x =>
                x.cellType === "columnheader"
                    ? "column-header"
                    : x.cellType === "rowheader"
                    ? "row-header"
                    : ""}
            "
        >
            <slot></slot>
        </template>
    `;
}
