import { css, ElementStyles } from "@microsoft/fast-element";
import {
    CheckboxOptions,
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    fillColor,
    focusStrokeOuter,
    foregroundOnAccentRest,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralStrokeActive,
    neutralStrokeHover,
    neutralStrokeRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const checkboxStyles: (
    context: ElementDefinitionContext,
    definition: CheckboxOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: CheckboxOptions) =>
    css`
    ${display("inline-flex")} :host {
        align-items: center;
        outline: none;
        margin: calc(${designUnit} * 1px) 0;
        ${
            /*
             * Chromium likes to select label text or the default slot when
             * the checkbox is clicked. Maybe there is a better solution here?
             */ ""
        } user-select: none;
    }

    .control {
        position: relative;
        width: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        box-sizing: border-box;
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
        background: ${neutralFillInputRest};
        outline: none;
        cursor: pointer;
    }

    .label {
        font-family: ${bodyFont};
        color: ${neutralForegroundRest};
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

    .checked-indicator {
        width: 100%;
        height: 100%;
        display: block;
        fill: ${foregroundOnAccentRest};
        opacity: 0;
        pointer-events: none;
    }

    .indeterminate-indicator {
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${foregroundOnAccentRest};
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
    }

    :host(:not([disabled])) .control:hover {
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
        box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
    }


    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${disabledCursor};
    }

    :host([aria-checked="true"]:not(.indeterminate)) .checked-indicator,
    :host(.indeterminate) .indeterminate-indicator {
        opacity: 1;
    }

    :host([disabled]) {
        opacity: ${disabledOpacity};
    }
`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
            .control {
                forced-color-adjust: none;
                border-color: ${SystemColors.FieldText};
                background: ${SystemColors.Field};
            }
            .checked-indicator {
                fill: ${SystemColors.FieldText};
            }
            .indeterminate-indicator {
                background: ${SystemColors.FieldText};
            }
            :host(:not([disabled])) .control:hover, .control:active {
                border-color: ${SystemColors.Highlight};
                background: ${SystemColors.Field};
            }
            :host(:${focusVisible}) .control {
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([aria-checked="true"]:${focusVisible}:not([disabled])) .control {
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([aria-checked="true"]) .control {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover, .control:active {
                border-color: ${SystemColors.Highlight};
                background: ${SystemColors.HighlightText};
            }
            :host([aria-checked="true"]) .checked-indicator {
                fill: ${SystemColors.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
                fill: ${SystemColors.Highlight}
            }
            :host([aria-checked="true"]) .indeterminate-indicator {
                background: ${SystemColors.HighlightText};
            }
            :host([aria-checked="true"]) .control:hover .indeterminate-indicator {
                background: ${SystemColors.Highlight}
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled]) .control {
                forced-color-adjust: none;
                border-color: ${SystemColors.GrayText};
                background: ${SystemColors.Field};
            }
            :host([disabled]) .indeterminate-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .indeterminate-indicator {
                forced-color-adjust: none;
                background: ${SystemColors.GrayText};
            }
            :host([disabled]) .checked-indicator,
            :host([aria-checked="true"][disabled]) .control:hover .checked-indicator {
                forced-color-adjust: none;
                fill: ${SystemColors.GrayText};
            }
        `
        )
    );
