import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    density,
    designUnit,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const tabPanelStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    ${display("flex")} :host {
        box-sizing: border-box;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
    }
`;
