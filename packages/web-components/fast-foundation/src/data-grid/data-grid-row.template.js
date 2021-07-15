import { children, elements, html, slotted } from "@microsoft/fast-element";
import { DataGridCell } from "./data-grid-cell";
function createCellItemTemplate(context) {
    const cellTag = context.tagFor(DataGridCell);
    return html`
    <${cellTag}
        grid-column="${(x, c) => c.index + 1}"
        :rowData="${(x, c) => c.parent.rowData}"
        :columnDefinition="${x => x}"
    ></${cellTag}>
`;
}
function createHeaderCellItemTemplate(context) {
    const cellTag = context.tagFor(DataGridCell);
    return html`
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
export const dataGridRowTemplate = (context, definition) => {
    const cellItemTemplate = createCellItemTemplate(context);
    const headerCellItemTemplate = createHeaderCellItemTemplate(context);
    return html`
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
};
