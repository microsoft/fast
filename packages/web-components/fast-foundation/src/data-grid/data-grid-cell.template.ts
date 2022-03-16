import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { DataGridCell } from "./data-grid-cell";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridCell} component using
 * the provided prefix.
 * @public
 */
export const dataGridCellTemplate: FoundationElementTemplate<ViewTemplate<
    DataGridCell
>> = (context, definition) => {
    return html<DataGridCell>`
        <template
            tabindex="-1"
            role="${x => x.cellType ?? "gridcell"}"
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
};
