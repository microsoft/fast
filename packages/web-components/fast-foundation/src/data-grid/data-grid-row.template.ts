import {
    children,
    elements,
    html,
    item,
    ItemViewTemplate,
    slotted,
} from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { ElementDefinitionContext } from "../design-system/registration-context.js";
import type { DataGridRow } from "./data-grid-row.js";
import { DataGridCell } from "./data-grid-cell.js";
import type { ColumnDefinition } from "./data-grid.js";

function createCellItemTemplate(
    context: ElementDefinitionContext
): ItemViewTemplate<ColumnDefinition, DataGridRow> {
    const cellTag = context.tagFor(DataGridCell);
    return item<ColumnDefinition, DataGridRow>`
    <${cellTag}
        cell-type="${x => (x.isRowHeader ? "rowheader" : undefined)}"
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}

function createHeaderCellItemTemplate(
    context: ElementDefinitionContext
): ItemViewTemplate<ColumnDefinition, DataGridRow> {
    const cellTag = context.tagFor(DataGridCell);
    return item<ColumnDefinition, DataGridRow>`
    <${cellTag}
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridRow} component using
 * the provided prefix.
 *
 * @public
 */
export const dataGridRowTemplate: FoundationElementTemplate<ViewTemplate<DataGridRow>> = (
    context,
    definition
) => {
    const cellItemTemplate = createCellItemTemplate(context);
    const headerCellItemTemplate = createHeaderCellItemTemplate(context);
    return html<DataGridRow>`
        <template
            role="row"
            :classList="${x => (x.rowType !== "default" ? x.rowType : "")}"
            :defaultCellItemTemplate="${cellItemTemplate}"
            :defaultHeaderCellItemTemplate="${headerCellItemTemplate}"
            ${children({
                property: "cellElements",
                filter: elements(
                    '[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]'
                ),
            })}
        >
            <slot ${slotted("slottedCellElements")}></slot>
        </template>
    `;
};
