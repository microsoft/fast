import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTDataList } from "./data-list.js";

/**
 * Options for data list templates.
 * @public
 */
export type DataListOptions = {
    dataListItem: TemplateElementDependency;
};

/**
 * Creates a default item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultItemTemplate<T extends FASTDataList>(
    options: DataListOptions
): ViewTemplate<any, T> {
    const listItemTag = html.partial(tagFor(options.dataListItem));
    return html<any, T>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemContentsTemplate="${(x, c) => c.parent.itemContentsTemplate}"
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
        <template
            :defaultHorizontalItemTemplate="${defaultItemTemplate(options)}"
            :defaultVerticalItemTemplate="${defaultItemTemplate(options)}"
        >
            <slot></slot>
        </template>
    `;
}
