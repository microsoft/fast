import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTDataList } from "./data-list.js";

/**
 * Options for data grid templates.
 * @public
 */
export type DataListOptions = {
    dataListItem: TemplateElementDependency;
};

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataList} component.
 * @public
 */
export function dataListTemplate(
    options: DataListOptions
): ElementViewTemplate<FASTDataList> {
    return html<FASTDataList>`
        <template>
            <slot></slot>
        </template>
    `;
}
