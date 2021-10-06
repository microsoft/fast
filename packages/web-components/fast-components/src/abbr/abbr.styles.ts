import { css } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    accentForegroundRest,
    bodyFont,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const abbrStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    ${display("inline")} :host {
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        color: ${neutralForegroundRest};
        border-bottom: 1px dashed ${accentForegroundRest};
    }
`;
