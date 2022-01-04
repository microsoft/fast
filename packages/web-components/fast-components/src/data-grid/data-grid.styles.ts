import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";

/**
 * Styles for Data Grid
 * @public
 */
export const dataGridStyles: FoundationElementTemplate<ElementStyles> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        display: flex;
        position: relative;
        flex-direction: column;
    }
`;
