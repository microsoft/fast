import { html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { GalleryPanel } from "./gallery-panel";
import { GalleryGroup } from "./gallery-group";

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
    const galleryGroupTag = context.tagFor(GalleryGroup);
    return html<GalleryPanel>`
        <template class="gallery-panel">
            <${galleryGroupTag}
                ${ref("galleryGroupElement")}
            ></${galleryGroupTag}>
        </template>
    `;
};
