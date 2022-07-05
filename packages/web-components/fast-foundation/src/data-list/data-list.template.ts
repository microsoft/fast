import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
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
 * Creates a default vertical item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultVerticalItemTemplate(
    options: DataListOptions
): ViewTemplate<any, FASTDataList> {
    const listItemTag = tagFor(options.dataListItem);
    return html<any, FASTDataList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        :idleLoad="${(x, c) => (c.parent.idleLoadMode === "enabled" ? true : false)}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
    ></${listItemTag}>
`;
}

/**
 * Creates a default horizontal item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultHorizontalItemTemplate(
    options: DataListOptions
): ViewTemplate<any, FASTDataList> {
    const listItemTag = tagFor(options.dataListItem);
    return html<any, FASTDataList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        :idleLoad="${(x, c) => (c.parent.idleLoadMode === "enabled" ? true : false)}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
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
            :defaultVerticalItemTemplate="${defaultVerticalItemTemplate(options)}"
            :defaultHorizontalItemTemplate="${defaultHorizontalItemTemplate(options)}"
        >
            <div
                class="container"
                part="container"
                style="
                width: ${x => (x.orientation === Orientation.vertical ? "100%" : "auto")};
                height: ${x =>
                    x.orientation !== Orientation.vertical ? "100%" : "auto"};
            "
            >
                <slot></slot>
            </div>
        </template>
    `;
}
