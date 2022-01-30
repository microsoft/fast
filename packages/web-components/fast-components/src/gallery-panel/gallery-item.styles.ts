import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";

/**
 *
 * @public
 */
export const galleryItemStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        .gallery-item {
            width: 100%;
            height: 100%;
            contain: strict;
        }
        .gallery-item-image {
            margin: 30px 20px 10px 20px;
            position: absolute;
            height: 160px;
            width: 160px;
        }
        .gallery-item-title {
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css``));
