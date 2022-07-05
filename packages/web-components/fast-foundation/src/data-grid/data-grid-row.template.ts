import {
    children,
    elements,
    ElementViewTemplate,
    html,
    slotted,
} from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/index.js";
import type { FASTDataGridRow } from "./data-grid-row.js";
import type { ColumnDefinition } from "./data-grid.js";

/**
 * Options for data grid cells.
 * @public
 */
export type CellItemTemplateOptions = {
    dataGridCell: TemplateElementDependency;
};

function cellItemTemplate(
    options: CellItemTemplateOptions
): ViewTemplate<ColumnDefinition, FASTDataGridRow> {
    const cellTag = tagFor(options.dataGridCell);
    return html<ColumnDefinition, FASTDataGridRow>`
    <${cellTag}
        cell-type="${x => (x.isRowHeader ? "rowheader" : undefined)}"
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}

function headerCellItemTemplate(
    options: CellItemTemplateOptions
): ViewTemplate<ColumnDefinition, FASTDataGridRow> {
    const cellTag = tagFor(options.dataGridCell);
    return html<ColumnDefinition, FASTDataGridRow>`
    <${cellTag}
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#FASTDataGridRow} component using
 * the provided prefix.
 *
 * @public
 */
export function dataGridRowTemplate(
    options: CellItemTemplateOptions
): ElementViewTemplate<FASTDataGridRow> {
    return html<FASTDataGridRow>`
        <template
            role="row"
            :classList="${x => (x.rowType !== "default" ? x.rowType : "")}"
            :defaultCellItemTemplate="${cellItemTemplate(options)}"
            :defaultHeaderCellItemTemplate="${headerCellItemTemplate(options)}"
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
}
