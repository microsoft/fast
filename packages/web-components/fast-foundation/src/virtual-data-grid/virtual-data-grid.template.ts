import {
    children,
    elements,
    ElementViewTemplate,
    html,
    ref,
    ViewTemplate,
} from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTVirtualDataGrid } from "./virtual-data-grid.js";

/**
 * Options for data grid templates.
 * @public
 */
export type DataGridOptions = {
    dataGridRow: TemplateElementDependency;
};

function rowItemTemplate(
    options: DataGridOptions
): ViewTemplate<any, FASTVirtualDataGrid> {
    const rowTag = tagFor(options.dataGridRow);
    return html<any, FASTVirtualDataGrid>`
    <${rowTag}
        style="grid-row:${(x, c) => c.index + c.parent.virtualizedIndexOffset}"
        slot="generated-rows"
        :rowIndex="${(x, c) =>
            c.parent.authoredRowCount + c.parent.firstRenderedIndex + c.index}"
        :rowData="${x => x}"
        :cellItemTemplate="${(x, c) => c.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(x, c) => c.parent.headerCellItemTemplate}"
        style="
            transform: ${(x, c) =>
                `translateY(${c.parent?.renderedItemMap[c.index]?.start}px)`};
        "
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
): ElementViewTemplate<FASTVirtualDataGrid> {
    const rowTag = tagFor(options.dataGridRow);
    return html<FASTVirtualDataGrid>`
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
            <div
                class="main"
                part="main"
            >
                <slot></slot>
                <div
                    class="container"
                    part="container"
                    style="
                        height: ${x => x.totalListSpan}px;
                        grid-template-rows:
                            ${x => x.startSpacerSpan}px
                            repeat(${x => x.visibleItems.length}, ${x => x.itemSpan}px)
                            ${x => x.endSpacerSpan}px;"
                    ${ref("containerElement")}
                >
                <slot name="generated-items"></slot>
                </div>
            <div>
    </template>
    `;
}
