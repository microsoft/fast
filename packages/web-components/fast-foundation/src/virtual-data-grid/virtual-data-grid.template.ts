import {
    children,
    elements,
    ElementViewTemplate,
    html,
    ref,
} from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTVirtualDataGrid } from "./virtual-data-grid.js";

/**
 * Options for data grid templates.
 * @public
 */
export type VirtualDataGridOptions = {
    dataGridRow: TemplateElementDependency;
};

function rowItemTemplate<T extends FASTVirtualDataGrid>(
    options: VirtualDataGridOptions
): ViewTemplate<any, T> {
    const rowTag = tagFor(options.dataGridRow);
    return html<any, T>`
    <${rowTag}
        slot="generated-items"
        style="
            position: absolute;
            height: ${(x, c) => c.parent.itemSize}px;
            transform: ${(x, c) =>
                `translateY(${c.parent.renderedItemMap[c.index]?.start}px)`};
        "
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
export function virtualDataGridTemplate<T extends FASTVirtualDataGrid>(
    options: VirtualDataGridOptions
): ElementViewTemplate<T> {
    const rowTag = tagFor(options.dataGridRow);
    return html<T>`
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
            <div
                class="container"
                part="container"
                style="width: 100%; height: ${x => `${x.totalListSize}px`};"
                ${ref("containerElement")}
            >
                <slot name="generated-items"></slot>
            </div>
        </template>
    `;
}
