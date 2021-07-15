import { children, elements, html } from "@microsoft/fast-element";
import { DataGridRow } from "./data-grid-row";
function createRowItemTemplate(context) {
    const rowTag = context.tagFor(DataGridRow);
    return html`
    <${rowTag}
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
    ></${rowTag}>
`;
}
/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataGrid} component using
 * the provided prefix.
 *
 * @public
 */
export const dataGridTemplate = (context, definition) => {
    const rowItemTemplate = createRowItemTemplate(context);
    const rowTag = context.tagFor(DataGridRow);
    return html`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${() => rowTag}"
            :defaultRowItemTemplate="${rowItemTemplate}"
            ${children({
                property: "rowElements",
                filter: elements("[role=row]"),
            })}
        >
            <slot></slot>
        </template>
    `;
};
