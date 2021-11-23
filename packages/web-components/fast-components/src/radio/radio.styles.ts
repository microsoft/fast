import { css, ElementStyles } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    RadioOptions,
} from "@microsoft/fast-foundation";
import { heightNumber } from "../styles";
import {
    accentFillActive,
    accentFillFocus,
    accentFillHover,
    accentFillRest,
    bodyFont,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentRest,
    neutralFillInputActive,
    neutralFillInputRest,
    neutralForegroundRest,
    strokeControlStrongActive,
    strokeControlStrongFocus,
    strokeControlStrongHover,
    strokeControlStrongRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

/**
 * Styles for Radio
 * @public
 */
export const radioStyles: (
    context: ElementDefinitionContext,
    definition: RadioOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: RadioOptions) =>
    css`
    ${display("inline-flex")} :host {
        --input-size: calc((${heightNumber} / 2) + (${strokeWidth} * 2));
        align-items: center;
        outline: none;
        margin: calc(${designUnit} * 1px) 0;
        ${
            /*
             * Chromium likes to select label text or the default slot when
             * the radio button is clicked. Maybe there is a better solution here?
             */ ""
        }
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
    :host(:enabled:hover) .control {
        border-color: ${strokeControlStrongHover};
    }
    :host(:enabled:active) .control {
        background: ${neutralFillInputActive};
        border-color: ${strokeControlStrongActive};
    }
    :host(:${focusVisible}) .control {
        border-color: ${strokeControlStrongFocus};
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
        outline-offset: calc(${strokeWidth} * 1px);
    }
    :host(.checked) .control {
        background: ${accentFillRest};
        border-color: ${accentFillRest};
    }
    :host(.checked:enabled:hover) .control {
        background: ${accentFillHover};
        border-color: ${accentFillHover};
    }
    :host(.checked:enabled:active) .control {
        background: ${accentFillActive};
        border-color: ${accentFillActive};
    }
    :host(.checked:enabled:${focusVisible}) .control {
        background: ${accentFillFocus};
        border-color: ${accentFillFocus};
    }
    .label__hidden {
        display: none;
        visibility: hidden;
    }
    .label {
        font-family: ${bodyFont};
        color: ${neutralForegroundRest};
        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */ ""
        }
        padding-inline-start: calc(${designUnit} * 2px + 2px);
        margin-inline-end: calc(${designUnit} * 2px + 2px);
        cursor: pointer;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
    }
    slot[name="checked-indicator"] {
        flex-shrink: 0;
    }
    slot[name="checked-indicator"] {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        fill: ${foregroundOnAccentRest};
        opacity: 0;
        pointer-events: none;
    }
    :host(:enabled:active) slot[name="checked-indicator"] {
        opacity: 1;
    }
    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${disabledCursor};
    }
    :host(.checked) slot[name="checked-indicator"] {
        opacity: 1;
    }
    :host(.disabled) {
        opacity: ${disabledOpacity};
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .control {
                    border-color: ${SystemColors.FieldText};
                    background: ${SystemColors.Field};
                }
                :host(:enabled:hover) .control,
                .control:active {
                    border-color: ${SystemColors.Highlight};
                    background: ${SystemColors.Field};
                }
                :host(.checked) .control {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                }
                :host(.checked:enabled:hover) .control,
                .control:active {
                    border-color: ${SystemColors.Highlight};
                    background: ${SystemColors.HighlightText};
                }
                :host(:${focusVisible}) .control,
                :host(.checked:enabled:${focusVisible}) .control {
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.FieldText};
                    outline: calc(${focusStrokeWidth} * 1px) solid ${SystemColors.FieldText};
                    outline-offset: calc(${strokeWidth} * 1px);
                }
                :host(.checked) slot[name='checked-indicator'] {
                    fill: ${SystemColors.HighlightText};
                }
                :host(.checked:enabled:hover) slot[name='checked-indicator'],
                :host(.checked:enabled:${focusVisible}) slot[name='checked-indicator'] {
                    fill: ${SystemColors.Highlight};
                }
                :host(.disabled) {
                    opacity: 1;
                }
                :host(.disabled) .label {
                    color: ${SystemColors.GrayText};
                }
                :host(.disabled) .control,
                :host(.checked.disabled:hover) .control,
                .control:active {
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.GrayText};
                }
                :host(.disabled) slot[name='checked-indicator'],
                :host(.checked.disabled) .control:hover slot[name='checked-indicator'] {
                    fill: ${SystemColors.GrayText};
                }
            `
        )
    );
