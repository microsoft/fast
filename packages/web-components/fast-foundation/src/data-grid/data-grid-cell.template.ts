import { html } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { DataGridCell } from "./data-grid-cell.js";

/**
 * Generates a template for the {@link @ni/fast-foundation#DataGridCell} component using
 * the provided prefix.
 * @public
 */
export const dataGridCellTemplate: FoundationElementTemplate<ViewTemplate<
    DataGridCell
>> = (context, definition) => {
    return html<DataGridCell>`
        <template
            tabindex="-1"
            role="${x =>
                !x.cellType || x.cellType === "default" ? "gridcell" : x.cellType}"
            class="
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
};
