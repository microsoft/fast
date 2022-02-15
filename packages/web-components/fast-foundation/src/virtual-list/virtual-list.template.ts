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
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        style="
            height:  ${(x, c) => `${c.parent.visibleItemSpans[c.index]?.span}px`};
            transform: ${(x, c) =>
                `translateY(${c.parent.visibleItemSpans[c.index]?.start}px)`};
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
        :listItemContext="${(x, c) => c.parent.listItemContext}"
        style="
            width:  ${(x, c) => `${c.parent.visibleItemSpans[c.index]?.span}px`};
            transform: ${(x, c) =>
                `translateX(${c.parent.visibleItemSpans[c.index]?.start}px)`};
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
                        : `${x.totalListSpan}px`};
                height: ${x =>
                    x.orientation !== Orientation.vertical
                        ? "100%"
                        : `${x.totalListSpan}px`};
            "
                ${ref("containerElement")}
            >
                <slot></slot>
            </div>
        </template>
    `;
};
