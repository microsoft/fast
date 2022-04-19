import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { ElementDefinitionContext } from "..";
import type { FoundationElementTemplate } from "../foundation-element";
import type { VirtualList } from "./virtual-list";
import { VirtualListItem } from "./virtual-list-item";

function createDefaultVerticalItemTemplate(
    context: ElementDefinitionContext
): ViewTemplate {
    const listItemTag = context.tagFor(VirtualListItem);
    return html`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index + c.parent.firstRenderedIndex}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        :idleCallbackQueue="${(x, c) => c.parent.idleCallbackQueue}"
        :loadMode="${(x, c) => c.parent.listItemLoadMode}"
        style="
            height:  ${(x, c) => `${c.parent.visibleItemMap[c.index]?.size}px`};
            transform: ${(x, c) =>
                `translateY(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    ></${listItemTag}>
`;
}

function createDefaultHorizontalItemTemplate(
    context: ElementDefinitionContext
): ViewTemplate {
    const listItemTag = context.tagFor(VirtualListItem);
    return html`
    <${listItemTag}
        :itemData="${x => x}"
        :itemIndex="${(x, c) => c.index + c.parent.firstRenderedIndex}"
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        :idleCallbackQueue="${(x, c) => c.parent.idleCallbackQueue}"
        :loadMode="${(x, c) => c.parent.listItemLoadMode}"
        style="
            width:  ${(x, c) => `${c.parent.visibleItemMap[c.index]?.size}px`};
            transform: ${(x, c) =>
                `translateX(${c.parent.visibleItemMap[c.index]?.start}px)`};
        "
    ></${listItemTag}>
`;
}

/**
 * The template for the {@link @microsoft/fast-foundation#VirtualList} component.
 * @public
 */
export const virtualListTemplate: FoundationElementTemplate<ViewTemplate<VirtualList>> = (
    context,
    definition
) => {
    const defaultVerticalItemTemplate: ViewTemplate = createDefaultVerticalItemTemplate(
        context
    );
    const defaultHorizontalItemTemplate: ViewTemplate = createDefaultHorizontalItemTemplate(
        context
    );
    return html<VirtualList>`
        <template
            :defaultVerticalItemTemplate="${defaultVerticalItemTemplate}"
            :defaultHorizontalItemTemplate="${defaultHorizontalItemTemplate}"
        >
            <div
                class="container"
                part="container"
                style="
                width: ${x =>
                    x.orientation === Orientation.vertical
                        ? "100%"
                        : `${x.totalListSize}px`};
                height: ${x =>
                    x.orientation !== Orientation.vertical
                        ? "100%"
                        : `${x.totalListSize}px`};
            "
                ${ref("containerElement")}
            >
                <slot></slot>
            </div>
        </template>
    `;
};
