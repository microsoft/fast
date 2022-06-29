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

function cellItemTemplate<T extends FASTDataGridRow>(
    options: CellItemTemplateOptions
): ViewTemplate<ColumnDefinition, T> {
    const cellTag = html.partial(tagFor(options.dataGridCell));
    return html<ColumnDefinition, T>`
    <${cellTag}
        cell-type="${x => (x.isRowHeader ? "rowheader" : undefined)}"
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}

function headerCellItemTemplate<T extends FASTDataGridRow>(
    options: CellItemTemplateOptions
): ViewTemplate<ColumnDefinition, T> {
    const cellTag = html.partial(tagFor(options.dataGridCell));
    return html<ColumnDefinition, T>`
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
export function dataGridRowTemplate<T extends FASTDataGridRow>(
    options: CellItemTemplateOptions
): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="row"
            :defaultCellItemTemplate="${cellItemTemplate(options)}"
            :defaultHeaderCellItemTemplate="${headerCellItemTemplate(options)}"
            aria-selected="${x => (x.selected !== undefined ? x.selected : void 0)}"
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
