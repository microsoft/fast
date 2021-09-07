import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    neutralFillHover,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralForegroundRest,
    neutralStrokeRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const textAreaStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
    ${display("inline-block")} :host {
        font-family: ${bodyFont};
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        color: ${neutralForegroundRest};
        background: ${neutralFillInputRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${accentFillRest};
        height: calc(${heightNumber} * 2px);
        font: inherit;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        padding: calc(${designUnit} * 2px + 1px);
        width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: ${neutralFillInputHover};
        border-color: ${accentFillHover};
    }

    .control:active:enabled {
        background: ${neutralFillInputActive};
        border-color: ${accentFillActive};
    }

    .control:hover,
    .control:${focusVisible},
    .control:disabled,
    .control:active {
        outline: none;
    }

    :host(:focus-within) .control {
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 1px ${focusStrokeOuter} inset;
    }

    :host([appearance="filled"]) .control {
        background: ${neutralFillRest};
    }

    :host([appearance="filled"]:hover:not([disabled])) .control {
        background: ${neutralFillHover};
    }

    :host([resize="both"]) .control {
        resize: both;
    }

    :host([resize="horizontal"]) .control {
        resize: horizontal;
    }

    :host([resize="vertical"]) .control {
        resize: vertical;
    }

    .label {
        display: block;
        color: ${neutralForegroundRest};
        cursor: pointer;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${disabledCursor};
    }
    :host([disabled]) {
        opacity: ${disabledOpacity};
    }
    :host([disabled]) .control {
        border-color: ${neutralStrokeRest};
    }
 `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host([disabled]) {
                    opacity: 1;
                }
            `
        )
    );
