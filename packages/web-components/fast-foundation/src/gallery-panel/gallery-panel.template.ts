import { html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import { VirtualList } from "../virtual-list";
import type { GalleryPanel } from "./gallery-panel";
import { Gallery } from "./gallery";

function createItemTemplate(context): ViewTemplate {
    const galleryTag = context.tagFor(Gallery);
    return html`
    <${galleryTag}
        style="
            position: absolute;
            height:  ${(x, c) => `${c.parent.visibleItemSpans[c.index]?.span}px`};
            transform: ${(x, c) =>
                `translateY(${c.parent.visibleItemSpans[c.index]?.start}px)`};
        "
        :galleryData="${x => x}"
    ></${galleryTag}>
`;
}

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(Tooltip:class)} component using the provided prefix.
 * @public
 */
export const galleryPanelTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => {
    const itemTemplate: ViewTemplate = createItemTemplate(context);
    const virtualListTag = context.tagFor(VirtualList);
    return html<GalleryPanel>`
        <template class="gallery-panel">
            <div class="gallery-panel-title">
                ${x => x.panelData?.title}
            </div>
            <${virtualListTag}
                class="gallery-panel-list"
                auto-update-mode="auto"
                item-span="400"
                viewport-buffer="800"
                :itemTemplate="${itemTemplate}"
                ${ref("galleriesListElement")}
            ></${virtualListTag}>
        </template>
    `;
};
