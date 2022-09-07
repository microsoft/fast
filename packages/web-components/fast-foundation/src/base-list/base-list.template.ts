import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
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
 * Creates a default item template.  This is the template that defines what list items are created by the
 * list's repeat directive.
 */
function defaultItemTemplate(options: BaseListOptions): ViewTemplate<any, FASTBaseList> {
    const listItemTag = tagFor(options.baseListItem);
    return html<any, FASTBaseList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index}"
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
        <template :defaultItemTemplate="${defaultItemTemplate(options)}">
            <slot></slot>
        </template>
    `;
}
