import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import { VirtualList } from "../virtual-list";
import { GalleryItem } from "./gallery-item";
import type { Gallery } from "./gallery";

function createGalleryItemTemplate(context): ViewTemplate {
    const galleryItemTag = context.tagFor(GalleryItem);
    return html`
    <${galleryItemTag}
         class="gallery-item"
        :galleryItemData="${x => x}"
        style="
            transform: ${(x, c) =>
                `translateX(${c.parent.visibleItemSpans[c.index]?.start}px)`};
        "
    >
    </${galleryItemTag}>
`;
}

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(Tooltip:class)} component using the provided prefix.
 * @public
 */
export const galleryTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => {
    const itemTemplate: ViewTemplate = createGalleryItemTemplate(context);
    const virtualListTag = context.tagFor(VirtualList);
    return html<Gallery>`
        <template class="gallery">
            <h3 class="gallery-title">${x => x.galleryData?.title}</h3>
            <${virtualListTag}
                class="gallery-list"
                orientation="horizontal"
                auto-update-mode="auto"
                item-span="210"
                viewport-buffer="600"
                :items="${x => x.galleryData?.items}"
                :itemTemplate="${itemTemplate}"
                ${ref("galleryListElement")}
            ></${virtualListTag}>
        </template>
    `;
};
