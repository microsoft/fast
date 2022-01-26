import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { GalleryItem } from "./gallery-item";

/**
 * Creates a template for the {@link @microsoft/fast-foundation#(Tooltip:class)} component using the provided prefix.
 * @public
 */
export const galleryItemTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => {
    return html<GalleryItem>`
        <template>
            <div class="gallery-item-title">
                ${x => x.galleryItemData?.title}
            </div>
        </template>
    `;
};
