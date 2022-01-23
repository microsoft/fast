import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import type { GalleryPanel } from "./gallery-panel";

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
    return html<GalleryPanel>`
        <template>
            <div class="gallery-title">
                TEST!
            </div>
        </template>
    `;
};
