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
            position: absolute;
            margin: 10px 5px 0 5px;
            width: 200px;
            height: 260px;
            contain: strict;
            background: olive;
        }
        .gallery-item-image {
            margin: 0 10px 10px 10px;
            position: absolute;
            height: 180px;
            width: 180px;
        }
        .gallery-item-title {
            margin: 5px 10px 5px 10px;
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css``));
