import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";

/**
 * Styles for AnchoredRegion
 * @public
 */
export const anchoredRegionStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        contain: layout;
        display: block;
    }
`;
