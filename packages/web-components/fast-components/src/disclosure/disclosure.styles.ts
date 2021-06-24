import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    bodyFont,
    controlCornerRadius,
    foregroundOnAccentRest,
    strokeWidth,
    typeRampBaseFontSize,
} from "../design-tokens";

export const disclosureStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    .disclosure {
        transition: height 0.35s;
    }

    .disclosure .invoker::-webkit-details-marker {
        display: none;
    }

    .disclosure .invoker {
        list-style-type: none;
    }

    :host([appearance="accent"]) .invoker {
        background: ${accentFillRest};
        color: ${foregroundOnAccentRest};
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        border-radius: calc(${controlCornerRadius} * 1px);
        outline: none;
        cursor: pointer;
        margin: 16px 0;
        padding: 12px;
        max-width: max-content;
    }

    :host([appearance="accent"]) .invoker:active {
        background: ${accentFillActive};
    }

    :host([appearance="accent"]) .invoker:hover {
        background: ${accentFillHover};
    }

    :host([appearance="lightweight"]) .invoker {
        background: transparent;
        color: ${accentForegroundRest};
        border-bottom: calc(${strokeWidth} * 1px) solid ${accentForegroundRest};
        cursor: pointer;
        width: max-content;
        margin: 16px 0;
    }

    :host([appearance="lightweight"]) .invoker:active {
        border-bottom-color: ${accentForegroundActive};
    }

    :host([appearance="lightweight"]) .invoker:hover {
        border-bottom-color: ${accentForegroundHover};
    }

    .disclosure[open] .invoker ~ * {
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;
