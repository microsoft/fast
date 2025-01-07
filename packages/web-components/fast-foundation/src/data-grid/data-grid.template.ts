import { children, elements, html } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { ElementDefinitionContext } from "../design-system/registration-context.js";
import type { DataGrid } from "./data-grid.js";
import { DataGridRow } from "./data-grid-row.js";

function createRowItemTemplate(context: ElementDefinitionContext): ViewTemplate {
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
 * Generates a template for the {@link @ni/fast-foundation#DataGrid} component using
 * the provided prefix.
 *
 * @public
 */
export const dataGridTemplate: FoundationElementTemplate<ViewTemplate<DataGrid>> = (
    context,
    definition
) => {
    const rowItemTemplate: ViewTemplate = createRowItemTemplate(context);
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
