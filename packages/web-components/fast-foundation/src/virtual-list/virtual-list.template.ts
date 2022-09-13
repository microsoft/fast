import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { tagFor, TemplateElementDependency } from "../patterns/tag-for.js";
import type { FASTDataList } from "../index.js";
import { VirtualListController } from "./virtual-list-controller.js";

/**
 * Options for virtual list templates
 * @public
 */
export type VirtualListOptions = {
    defaultListItem: TemplateElementDependency;
};

/**
 * Creates a default vertical item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultVerticalItemTemplate(
    options: VirtualListOptions
): ViewTemplate<any, FASTDataList> {
    const listItemTag = tagFor(options.defaultListItem);
    return html<any, FASTDataList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index + c.parent.listController.firstRenderedIndex}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
        :sizeMap="${(x, c) => c.parent.listController.sizemap}"
        style="
            transform: ${(x, c) =>
                `translateY(${
                    c.parent.listController.visibleItemMap[c.index]?.start
                }px)`};
        "
    ></${listItemTag}>
`;
}

/**
 * Creates a default horizontal item template.  This is the template that defines what list items are created by the
 * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
 */
function defaultHorizontalItemTemplate(
    options: VirtualListOptions
): ViewTemplate<any, FASTDataList> {
    const listItemTag = tagFor(options.defaultListItem);
    return html<any, FASTDataList>`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index + c.parent.listController.firstRenderedIndex}"
        :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
        :sizeMap="${(x, c) => c.parent.listController.sizemap}"
        style="
            transform: ${(x, c) =>
                `translateX(${
                    c.parent.listController.visibleItemMap[c.index]?.start
                }px)`};
        "
    ></${listItemTag}>
`;
}

/**
 * Generates a template for the {@link @microsoft/fast-foundation#VirtualList} component.
 * @public
 */
export function virtualListTemplate(
    options: VirtualListOptions
): ElementViewTemplate<FASTDataList> {
    return html<FASTDataList>`
        <template
            :listController="${new VirtualListController()}"
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
                        : `${x.listController.totalListSize}px`};
                    height: ${x =>
                    x.orientation !== Orientation.vertical
                        ? "100%"
                        : `${x.listController.totalListSize}px`};
                "
            >
                <slot></slot>
            </div>
        </template>
    `;
}

// /**
//  * Creates a default vertical item template.  This is the template that defines what list items are created by the
//  * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
//  */
//  function defaultVerticalItemTemplate(
//     options: VirtualListOptions
// ): ViewTemplate<any, FASTVirtualList> {
//     const listItemTag = tagFor(options.defaultListItem);
//     return html<any, FASTVirtualList>`
//     <${listItemTag}
//         :itemData="${x => x}"
//         :itemIndex="${(x, c) => c.index + c.parent.firstRenderedIndex}"
//         :idleCallbackQueue="${(x, c) => c.parent.idleCallbackQueue}"
//         :loadMode="${(x, c) => c.parent.listItemLoadMode}"
//         :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
//         :sizeMap="${(x, c) => c.parent.sizemap}"
//         style="
//             transform: ${(x, c) =>
//                 `translateY(${c.parent.visibleItemMap[c.index]?.start}px)`};
//         "
//     ></${listItemTag}>
// `;
// }

// /**
//  * Creates a default horizontal item template.  This is the template that defines what list items are created by the
//  * list's repeat directive.  Authors can improve performance by tailoring templates to their specific scenario.
//  */
// function defaultHorizontalItemTemplate(
//     options: VirtualListOptions
// ): ViewTemplate<any, FASTVirtualList> {
//     const listItemTag = tagFor(options.defaultListItem);
//     return html<any, FASTVirtualList>`
//     <${listItemTag}
//         :itemData="${x => x}"
//         :itemIndex="${(x, c) => c.index + c.parent.firstRenderedIndex}"
//         :idleCallbackQueue="${(x, c) => c.parent.idleCallbackQueue}"
//         :loadMode="${(x, c) => c.parent.listItemLoadMode}"
//         :listItemContentsTemplate="${(x, c) => c.parent.listItemContentsTemplate}"
//         :sizeMap="${(x, c) => c.parent.sizemap}"
//         style="
//             transform: ${(x, c) =>
//                 `translateX(${c.parent.visibleItemMap[c.index]?.start}px)`};
//         "
//     ></${listItemTag}>
// `;
// }

// /**
//  * Generates a template for the {@link @microsoft/fast-foundation#VirtualList} component.
//  * @public
//  */
// export function virtualListTemplate(
//     options: VirtualListOptions
// ): ElementViewTemplate<FASTVirtualList> {
//     return html<FASTVirtualList>`
//         <template
//             :defaultVerticalItemTemplate="${defaultVerticalItemTemplate(options)}"
//             :defaultHorizontalItemTemplate="${defaultHorizontalItemTemplate(options)}"
//         >
//             <div
//                 class="container"
//                 part="container"
//                 style="
//                 width: ${x =>
//                     x.orientation === Orientation.vertical
//                         ? "100%"
//                         : `${x.totalListSize}px`};
//                 height: ${x =>
//                     x.orientation !== Orientation.vertical
//                         ? "100%"
//                         : `${x.totalListSize}px`};
//             "
//                 ${ref("containerElement")}
//             >
//                 <slot></slot>
//             </div>
//         </template>
//     `;
// }
