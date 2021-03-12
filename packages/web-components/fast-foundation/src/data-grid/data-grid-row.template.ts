import { children, elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { DataGridRow } from "./data-grid-row";

function createCellItemTemplate(prefix: string): ViewTemplate {
    return html`
    <${prefix}-data-grid-cell
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></${prefix}-data-grid-cell>
`;
}

function createHeaderCellItemTemplate(prefix: string): ViewTemplate {
    return html`
    <${prefix}-data-grid-cell
        cell-type="columnheader"
        grid-column="${(x, c) => c.index + 1}"
        :columnDefinition="${x => x}"
    ></${prefix}-data-grid-header-cell>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGridRow} component using
 * the provided prefix.
 *
 * @public
 */
export function createDataGridRowTemplate(prefix: string): ViewTemplate {
    const cellItemTemplate: ViewTemplate = createCellItemTemplate(prefix);
    const headerCellItemTemplate: ViewTemplate = createHeaderCellItemTemplate(prefix);
    return html<DataGridRow>`
        <template
            role="row"
            class="${x => (x.rowType !== "default" ? x.rowType : "")}"
            :defaultCellItemTemplate="${cellItemTemplate}"
            :defaultHeaderCellItemTemplate="${headerCellItemTemplate}"
            ${children({
                property: "cellElements",
                filter: elements('[role="cell"],[role="gridcell"],[role="columnheader"]'),
            })}
        >
            <slot ${slotted("slottedCellElements")}></slot>
        </template>
    `;
}
