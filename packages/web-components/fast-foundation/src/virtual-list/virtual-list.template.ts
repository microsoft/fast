import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTVirtualList } from "./virtual-list.js";

/**
 * Options for virtual list templates.
 * @public
 */
export type VirtualListOptions = {
    virtualListItem: TemplateElementDependency;
};

/**
 * Creates a default vertical item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultVerticalItemTemplate<T extends FASTVirtualList>(
    options: VirtualListOptions
): ViewTemplate<any, T> {
    const listItemTag = html.partial(tagFor(options.virtualListItem));
    return html<any, T>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index + c.parent.virtualizer.firstRenderedIndex}"
        :itemContentsTemplate="${(x, c) => c.parent.itemContentsTemplate}"
        :sizeMap="${(x, c) => c.parent.virtualizer.sizemap}"
        style="
            transform: ${(x, c) =>
                `translateY(${c.parent.virtualizer.renderedItemMap[c.index]?.start}px)`};
        "
    ></${listItemTag}>
`;
}

/**
 * Creates a default horizontal item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultHorizontalItemTemplate<T extends FASTVirtualList>(
    options: VirtualListOptions
): ViewTemplate<any, T> {
    const listItemTag = html.partial(tagFor(options.virtualListItem));
    return html<any, T>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index + c.parent.virtualizer.firstRenderedIndex}"
        :itemContentsTemplate="${(x, c) => c.parent.itemContentsTemplate}"
        :sizeMap="${(x, c) => c.parent.virtualizer.sizemap}"
        style="
            transform: ${(x, c) =>
                `translateX(${c.parent.virtualizer.renderedItemMap[c.index]?.start}px)`};
        "
    ></${listItemTag}>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#VirtualList} component.
 * @public
 */
export function virtualListTemplate<T extends FASTVirtualList>(
    options: VirtualListOptions
): ElementViewTemplate<T> {
    return html<T>`
        <template
            :defaultVerticalItemTemplate="${defaultVerticalItemTemplate(options)}"
            :defaultHorizontalItemTemplate="${defaultHorizontalItemTemplate(options)}"
        >
            <div
                class="container"
                part="container"
                style="
                width: ${x =>
                    x.orientation === Orientation.vertical
                        ? "100%"
                        : `${x.virtualizer.totalListSize}px`};
                height: ${x =>
                    x.orientation !== Orientation.vertical
                        ? "100%"
                        : `${x.virtualizer.totalListSize}px`};
            "
                ${ref("containerElement")}
            >
                <slot></slot>
            </div>
        </template>
    `;
}
