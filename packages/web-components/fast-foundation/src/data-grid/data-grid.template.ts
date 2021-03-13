import { children, elements, html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { DataGrid } from "./data-grid";

function createRowItemTemplate(prefix: string): ViewTemplate {
    return html`
    <${prefix}-data-grid-row
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></${prefix}-data-grid-row>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGrid} component using
 * the provided prefix.
 *
 * @public
 */
export function createDataGridTemplate(prefix: string): ViewTemplate {
    const rowItemTemplate: ViewTemplate = createRowItemTemplate(prefix);
    return html<DataGrid>`
        <template
            role="grid"
            tabindex="0"
            :defaultRowItemTemplate="${rowItemTemplate}"
            ${children({
                property: "rowElements",
                filter: elements("[role=row]"),
            })}
        >
            <slot></slot>
        </template>
    `;
}
