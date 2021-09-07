import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    RadioOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    bodyFont,
    designUnit,
    disabledOpacity,
    focusStrokeWidth,
    neutralFillInputActive,
    neutralFillInputRest,
    neutralForegroundActive,
    neutralForegroundRest,
    strokeControlStrongActive,
    strokeControlStrongFocus,
    strokeControlStrongHover,
    strokeControlStrongRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const radioStyles: (
    context: ElementDefinitionContext,
    definition: RadioOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: RadioOptions) =>
    css`
    ${display("inline-flex")} :host {
        --input-size: calc((${heightNumber} / 2) + ${designUnit});
        align-items: center;
        outline: none;
        margin: calc(${designUnit} * 1px) 0;
        /* Chromium likes to select label text or the default slot when
            the radio is clicked. Maybe there is a better solution here? */
        user-select: none;
        position: relative;
        flex-direction: row;
        transition: all 0.2s ease-in-out;
    }

    .control {
      position: relative;
      width: calc(var(--input-size) * 1px);
      height: calc(var(--input-size) * 1px);
      box-sizing: border-box;
      border-radius: 50%;
      border: calc(${strokeWidth} * 1px) solid ${strokeControlStrongRest};
      background: ${neutralFillInputRest};
      outline: none;
      cursor: pointer;
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
        background: ${foregroundOnAccentRest};
        fill: ${foregroundOnAccentRest};
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
        box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
    }

    slot[name="checked-indicator"] {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      fill: ${neutralForegroundActive};
      opacity: 0;
      pointer-events: none;
    }

    :host(.checked) .control {
      background: ${neutralFillInputActive};
      border-color: ${strokeControlStrongRest};
    }

    :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
        background: ${foregroundOnAccentHover};
        fill: ${foregroundOnAccentHover};
    }

    :host(:enabled:active) .control,
    :host(.checked:enabled:active) .control {
      background: ${neutralFillInputActive};
      border-color: ${strokeControlStrongActive};
    }

    :host(:${focusVisible}) .control,
    :host(.checked:enabled:${focusVisible}) .control {
      border-color: ${strokeControlStrongFocus};
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${strokeControlStrongFocus};
    }

    :host(:enabled:active) slot[name="checked-indicator"] {
      opacity: 1;
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
            :host([aria-checked="true"]:not([disabled])) .control {
                forced-color-adjust: none;
                border-color: ${SystemColors.FieldText};
                background: ${SystemColors.Field};
            }
            :host(:not([disabled])) .control:hover {
                border-color: ${SystemColors.Highlight};
                background: ${SystemColors.Field};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover,
            :host([aria-checked="true"]:not([disabled])) .control:active {
                border-color: ${SystemColors.Highlight};
                background: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${SystemColors.Highlight};
                fill: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator,
            :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
                background: ${SystemColors.HighlightText};
                fill: ${SystemColors.HighlightText};
            }
            :host(:${focusVisible}) .control {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([aria-checked="true"]:${focusVisible}:not([disabled])) .control {
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
            :host([aria-checked="true"][disabled]) .control:hover, .control:active {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                fill: ${SystemColors.GrayText};
                background: ${SystemColors.GrayText};
            }
        `
        )
    );
