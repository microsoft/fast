import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTDataList } from "./data-list.js";

/**
 * Options for data list templates.
 * @public
 */
export type DataListOptions = {
    defaultListItem: TemplateElementDependency;
};

/**
 * Creates a default item template.  This is the template that defines what list items are created by the
 * list's repeat directive.
 */
function defaultItemTemplate(options: DataListOptions): ViewTemplate<any, FASTDataList> {
    const listItemTag = tagFor(options.defaultListItem);
    return html<any, FASTDataList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
    ></${listItemTag}>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#DataList} component.
 * @public
 */
export function dataListTemplate<T extends FASTDataList>(
    options: DataListOptions
): ElementViewTemplate<T> {
    return html<T>`
        <template :defaultItemTemplate="${defaultItemTemplate(options)}">
            <slot></slot>
        </template>
    `;
}
