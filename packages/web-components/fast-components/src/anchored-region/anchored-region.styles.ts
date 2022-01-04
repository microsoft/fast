import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";

/**
 * Styles for AnchoredRegion
 * @public
 */
export const anchoredRegionStyles: FoundationElementTemplate<ElementStyles> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        contain: layout;
        display: block;
    }
`;
