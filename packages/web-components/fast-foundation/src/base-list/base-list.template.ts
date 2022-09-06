import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTBaseList } from "./base-list.js";

/**
 * Options for base list templates.
 * @public
 */
export type BaseListOptions = {
    baseListItem: TemplateElementDependency;
};

/**
 * Creates a default vertical item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultVerticalItemTemplate(
    options: BaseListOptions
): ViewTemplate<any, FASTBaseList> {
    const listItemTag = tagFor(options.baseListItem);
    return html<any, FASTBaseList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        :idleCallbackQueue="${(x, c) => c.parent.idleCallbackQueue}"
        :loadMode="${(x, c) => c.parent.listItemLoadMode}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
    ></${listItemTag}>
`;
}

/**
 * Creates a default horizontal item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultHorizontalItemTemplate(
    options: BaseListOptions
): ViewTemplate<any, FASTBaseList> {
    const listItemTag = tagFor(options.baseListItem);
    return html<any, FASTBaseList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        :idleCallbackQueue="${(x, c) => c.parent.idleCallbackQueue}"
        :loadMode="${(x, c) => c.parent.listItemLoadMode}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
    ></${listItemTag}>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#BaseList} component.
 * @public
 */
export function baseListTemplate(
    options: BaseListOptions
): ElementViewTemplate<FASTBaseList> {
    return html<FASTBaseList>`
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
                ${ref("containerElement")}
            >
                <slot></slot>
            </div>
        </template>
    `;
}
