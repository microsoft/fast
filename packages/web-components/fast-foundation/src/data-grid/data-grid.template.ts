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

function rowItemTemplate<T extends FASTDataGrid>(
    options: DataGridOptions
): ViewTemplate<any, T> {
    const rowTag = tagFor(options.dataGridRow);
    return html<any, T>`
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
export function dataGridTemplate<T extends FASTDataGrid>(
    options: DataGridOptions
): ElementViewTemplate<T> {
    const rowTag = tagFor(options.dataGridRow);
    return html<T>`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${() => rowTag}"
            :defaultVerticalItemTemplate="${rowItemTemplate(options)}"
            ${children({
                property: "rowElements",
                filter: elements("[role=row]"),
            })}
        >
            <slot></slot>
        </template>
    `;
}
