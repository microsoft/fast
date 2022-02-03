import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import { VirtualList } from "../virtual-list";
import { GalleryGroup } from "./gallery-group";
import { Gallery } from "./gallery";
import type { GalleryData } from "./gallery-data";

function createItemTemplate(context): ViewTemplate {
    const galleryTag = context.tagFor(Gallery);
    const galleryGroupTag = context.tagFor(GalleryGroup);
    return html<GalleryData>`
        ${when(
            x => x.galleryType === "gallery",
            html<GalleryData>`
                <${galleryTag}
                    style="
                        position: absolute;
                        height:  ${(x, c) =>
                            `${c.parent.visibleItemSpans[c.index]?.span}px`};
                        transform: ${(x, c) =>
                            `translateY(${c.parent.visibleItemSpans[c.index]?.start}px)`};
                    "
                    :galleryData="${x => x}"
                ></${galleryTag}>
            `
        )}
        ${when(
            x => x.galleryType === "gallery-group",
            html<GalleryData>`
                <${galleryGroupTag}
                    style="
                        position: absolute;
                        height:  ${(x, c) =>
                            `${c.parent.visibleItemSpans[c.index]?.span}px`};
                        transform: ${(x, c) =>
                            `translateY(${c.parent.visibleItemSpans[c.index]?.start}px)`};
                    "
                    :galleryData="${x => x}"
                    :spanmap="${(x, c) => c.parent.visibleItemSpans[c.index]?.children}"
                ></${galleryGroupTag}>
            `
        )}
    `;
}

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(Tooltip:class)} component using the provided prefix.
 * @public
 */
export const galleryGroupTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => {
    const itemTemplate: ViewTemplate = createItemTemplate(context);
    const virtualListTag = context.tagFor(VirtualList);
    return html<GalleryGroup>`
        <template class="gallery-group">
            <h2 class="gallery-group-title">${x => x.galleryData?.title}</h2>

            <${virtualListTag}
                class="gallery-group-list"
                auto-update-mode="auto"
                viewport-buffer="800"
                :itemTemplate="${itemTemplate}"
                :spanmap="${x => x.spanmap}"
                ${ref("galleriesListElement")}
            ></${virtualListTag}>
        </template>
    `;
};
