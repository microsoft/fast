import { children, elements, html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { DataGrid } from "./data-grid";
import { DataGridRow } from "./data-grid-row";

function createRowItemTemplate(context: ElementDefinitionContext): ViewTemplate {
    const rowTag = context.tagFor(DataGridRow);
    return html`
    <${rowTag}
        style="
            grid-row:${(x, c) => c.index + c.parent.virtualizedIndexOffset};
            height:100%;
            width: 100%;
        "
        slot="generated-rows"
        :rowIndex="${(x, c) =>
            c.parent.authoredRowCount + c.parent.firstRenderedIndex + c.index}"
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
            <div
                style="
                    display: grid;
                    height: ${x => x.totalStackSpan}px;
                    grid-template-rows:${x => x.gridTemplateSpans};
                "
                ${ref("containerElement")}
            >
                <slot></slot>
                <slot name="generated-rows"></slot>
            </div>
        </template>
    `;
};
