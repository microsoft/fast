import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    bodyFont,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    foregroundOnAccent,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForeground,
    neutralStrokeActive,
    neutralStrokeHover,
    neutralStrokeRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const radioStyles = (context, definition) =>
    css`
    ${display("inline-flex")} :host {
        --input-size: calc((${heightNumber} / 2) + ${designUnit});
        align-items: center;
        outline: none;
        margin: calc(${designUnit} * 1px) 0;
        ${
            /*
             * Chromium likes to select label text or the default slot when
             * the radio button is clicked. Maybe there is a better solution here?
             */ ""
        } user-select: none;
        position: relative;
        flex-direction: row;
        transition: all 0.2s ease-in-out;
    }

    .control {
        position: relative;
        width: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        box-sizing: border-box;
        border-radius: 999px;
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
        background: ${neutralFillInputRest};
        outline: none;
        cursor: pointer;
    }

    .label {
        font-family: ${bodyFont};
        color: ${neutralForeground};
        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */ ""
        } padding-inline-start: calc(${designUnit} * 2px + 2px);
        margin-inline-end: calc(${designUnit} * 2px + 2px);
        cursor: pointer;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .control, .checked-indicator {
        flex-shrink: 0;
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: 999px;
        display: inline-block;
        background: ${foregroundOnAccent};
        fill: ${foregroundOnAccent};
        opacity: 0;
        pointer-events: none;
    }

    :host(:not([disabled])) .control:hover{
        background: ${neutralFillInputHover};
        border-color: ${neutralStrokeHover};
    }

    :host(:not([disabled])) .control:active {
        background: ${neutralFillInputActive};
        border-color: ${neutralStrokeActive};
    }

    :host(:${focusVisible}) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px ${focusStrokeOuter};
        border-color: ${focusStrokeOuter};
    }

    :host([aria-checked="true"]) .control {
        background: ${accentFillRest};
        border: calc(${strokeWidth} * 1px) solid ${accentFillRest};
    }

    :host([aria-checked="true"]:not([disabled])) .control:hover {
        background: ${accentFillHover};
        border: calc(${strokeWidth} * 1px) solid ${accentFillHover};
    }

    :host([aria-checked="true"]:not([disabled])) .control:active {
        background: ${accentFillActive};
        border: calc(${strokeWidth} * 1px) solid ${accentFillActive};
    }

    :host([aria-checked="true"]:${focusVisible}:not([disabled])) .control {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px ${focusStrokeOuter};
        border-color: transparent;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${disabledCursor};
    }

    :host([aria-checked="true"]) .checked-indicator {
        opacity: 1;
    }

    :host([disabled]) {
        opacity: ${disabledOpacity};
    }
`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
            .control,
            :host([checked]:not([disabled])) .control {
                forced-color-adjust: none;
                border-color: ${SystemColors.FieldText};
                background: ${SystemColors.Field};
            }
            :host(:not([disabled])) .control:hover {
                border-color: ${SystemColors.Highlight};
                background: ${SystemColors.Field};
            }
            :host([checked]:not([disabled])) .control:hover,
            :host([checked]:not([disabled])) .control:active {
                border-color: ${SystemColors.Highlight};
                background: ${SystemColors.Highlight};
            }
            :host([checked]) .checked-indicator {
                background: ${SystemColors.Highlight};
                fill: ${SystemColors.Highlight};
            }
            :host([checked]:not([disabled])) .control:hover .checked-indicator,
            :host([checked]:not([disabled])) .control:active .checked-indicator {
                background: ${SystemColors.HighlightText};
                fill: ${SystemColors.HighlightText};
            }
            :host(:${focusVisible}) .control {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([checked]:${focusVisible}:not([disabled])) .control {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([disabled]) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host([disabled]) .label {
                color: ${SystemColors.GrayText};
            }
            :host([disabled]) .control,
            :host([checked][disabled]) .control:hover, .control:active {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([checked][disabled]) .control:hover .checked-indicator {
                fill: ${SystemColors.GrayText};
                background: ${SystemColors.GrayText};
            }
        `
        )
    );
