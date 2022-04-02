import {
    child,
    children,
    ChildViewTemplate,
    elements,
    html,
} from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { DataGrid } from "./data-grid";
import { DataGridRow } from "./data-grid-row";

function createRowItemTemplate(context): ChildViewTemplate<any, DataGrid> {
    const rowTag = context.tagFor(DataGridRow);
    return child<any, DataGrid>`
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
export const dataGridTemplate: FoundationElementTemplate<ViewTemplate<DataGrid>> = (
    context,
    definition
) => {
    const rowItemTemplate = createRowItemTemplate(context);
    const rowTag = context.tagFor(DataGridRow);
    return html<DataGrid>`
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
