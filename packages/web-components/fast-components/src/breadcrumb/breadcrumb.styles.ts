import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { bodyFont, typeRampBaseFontSize, typeRampBaseLineHeight } from "../design-tokens";

/**
 * Styles for Breadcrumb
 * @public
 */
export const breadcrumbStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
    }

    .list {
        display: flex;
        flex-wrap: wrap;
    }
`;
