import { css } from "@microsoft/fast-element";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    bodyFont,
    cornerRadius,
    outlineWidth,
    typeRampBaseFontSize,
} from "../design-tokens";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
} from "../styles/recipes";

export const disclosureStyles = css`
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
        color: ${accentForegroundCut};
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        border-radius: calc(${cornerRadius} * 1px);
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
        color: ${accentForegroundRestBehavior.var};
        border-bottom: calc(${outlineWidth} * 1px) solid var(--accent-foreground-rest);
        cursor: pointer;
        width: max-content;
        margin: 16px 0;
    }

    :host([appearance="lightweight"]) .invoker:active {
        border-bottom-color: ${accentForegroundActiveBehavior.var};
    }

    :host([appearance="lightweight"]) .invoker:hover {
        border-bottom-color: ${accentForegroundHoverBehavior.var};
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
`.withBehaviors(
    accentForegroundRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentFillHoverBehavior,
    accentFillActiveBehavior
);
