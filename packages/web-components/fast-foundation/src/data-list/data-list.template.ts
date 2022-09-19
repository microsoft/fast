import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTDataList } from "./data-list.js";

/**
 * Options for data grid templates.
 * @public
 */
export type DataListOptions = {
    dataListItem: TemplateElementDependency;
};

/**
 * Creates a default item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultItemTemplate(options: DataListOptions): ViewTemplate<any, FASTDataList> {
    const listItemTag = tagFor(options.dataListItem);
    return html<any, FASTDataList>`
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
export function dataListTemplate(
    options: DataListOptions
): ElementViewTemplate<FASTDataList> {
    return html<FASTDataList>`
        <template
            :defaultHorizontalItemTemplate="${defaultItemTemplate(options)}"
            :defaultVerticalItemTemplate="${defaultItemTemplate(options)}"
        >
            <slot></slot>
        </template>
    `;
}
