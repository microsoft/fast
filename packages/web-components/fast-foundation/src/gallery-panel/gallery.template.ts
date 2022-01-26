import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import { VirtualList } from "../virtual-list";
import { GalleryItem } from "./gallery-item";
import type { Gallery } from "./gallery";

function createItemTemplate(context): ViewTemplate {
    const galleryItemTag = context.tagFor(GalleryItem);
    return html`
    <${galleryItemTag}
        style="
            position: absolute;
            width: 100%;
        "
    ></${galleryItemTag}>
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
    const itemTemplate: ViewTemplate = createItemTemplate(context);
    const virtualListTag = context.tagFor(VirtualList);
    return html<Gallery>`
        <template class="gallery">
            <div class="gallery-title">
                ${x => x.galleryData?.title}
            </div>
            <${virtualListTag}
                style="
                    height: 200px;
                    width: 100%;
                "
                orientation="horizontal"
                auto-update-mode="auto"
                item-span="200"
                viewport-buffer="200"
                :itemTemplate="${itemTemplate}"
                ${ref("galleryListElement")}
            ></${virtualListTag}>
        </template>
    `;
};
