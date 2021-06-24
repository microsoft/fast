import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    accentForegroundRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const badgeStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
    ${display("inline-block")} :host {
        box-sizing: border-box;
        font-family: ${bodyFont};
        font-size: ${typeRampMinus1FontSize};
        line-height: ${typeRampMinus1LineHeight};
    }

    .control {
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: calc(${designUnit} * 0.5px) calc(${designUnit} * 1px);
        color: ${accentForegroundRest};
        font-weight: 600;
    }

    .control[style] {
        font-weight: 400;
    }

    :host([circular]) .control {
        border-radius: 100px;
        padding: 0 calc(${designUnit} * 1px);
        ${
            /* Need to work with Brian on width and height here */ ""
        } height: calc((${heightNumber} - (${designUnit} * 3)) * 1px);
        min-width: calc((${heightNumber} - (${designUnit} * 3)) * 1px);
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }
`;
