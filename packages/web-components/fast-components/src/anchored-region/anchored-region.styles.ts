import { css, ElementStyles } from "@microsoft/fast-element";
import { FoundationElementTemplate } from "@microsoft/fast-foundation";

/**
 * Styles for AnchoredRegion
 * @public
 */
export const anchoredRegionStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    :host {
        contain: layout;
        display: block;
    }
`;
