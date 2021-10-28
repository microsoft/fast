import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    bodyFont,
    designUnit,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const fileStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        .label {
            font-family: ${bodyFont};
            color: ${neutralForegroundRest};
            padding-inline-start: calc(${designUnit} * 2px + 2px);
            margin-inline-end: calc(${designUnit} * 2px + 2px);
            cursor: pointer;
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
        }
    `;
