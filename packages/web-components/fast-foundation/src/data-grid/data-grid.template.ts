import { children, elements, ElementViewTemplate, html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTDataGrid } from "./data-grid.js";

/**
 * Options for data grid templates.
 * @public
 */
export type DataGridOptions = {
    dataGridRow: TemplateElementDependency;
};

function rowItemTemplate(options: DataGridOptions): ViewTemplate<any, FASTDataGrid> {
    const rowTag = tagFor(options.dataGridRow);
    return html<any, FASTDataGrid>`
    <${rowTag}
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></${rowTag}>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#FASTDataGrid} component using
 * the provided prefix.
 *
 * @public
 */
export function dataGridTemplate(
    options: DataGridOptions
): ElementViewTemplate<FASTDataGrid> {
    const rowTag = tagFor(options.dataGridRow);
    return html<FASTDataGrid>`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${() => rowTag}"
            :defaultRowItemTemplate="${rowItemTemplate(options)}"
            ${children({
                property: "rowElements",
                filter: elements("[role=row]"),
            })}
        >
            <slot></slot>
        </template>
    `;
}
