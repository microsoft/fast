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
import { heightNumber } from "../styles";
import {
    bodyFont,
    designUnit,
    disabledOpacity,
<<<<<<< HEAD
    focusStrokeOuter,
=======
>>>>>>> chore: visual refresh on checkbox component (#5400)
    focusStrokeWidth,
    foregroundOnAccentRest,
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
import {
    accentFillActive,
    accentFillFocus,
    accentFillHover,
    accentFillRest,
    neutralFillInputHover,
} from "..";

/**
 * Styles for Checkbox
 * @public
 */
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
        width: calc((${heightNumber} / 2) + (${strokeWidth} * 2) * 1px);
        height: calc((${heightNumber} / 2) + (${strokeWidth} * 2) * 1px);
        box-sizing: border-box;
        border-radius: 3px;
        border: calc(${strokeWidth} * 1px) solid ${strokeControlStrongRest};
        background: ${neutralFillInputRest};
        outline: none;
        cursor: pointer;
    }
    :host(:hover) .control {
        background: ${neutralFillInputHover};
        border-color: ${strokeControlStrongHover};
    }
    :host(:active) .control {
        background: ${neutralFillInputActive};
        border-color: ${strokeControlStrongActive};
    }
    :host(:${focusVisible}) .control {
        border-color: ${strokeControlStrongFocus};
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
        outline-offset: calc(${strokeWidth} * 1px);
    }
    :host([aria-checked="true"]) .control {
        background: ${accentFillRest};
        border-color: ${accentFillRest};
    }
    :host([aria-checked="true"]:enabled:hover) .control {
        background: ${accentFillHover};
        border-color: ${accentFillHover};
    }
    :host([aria-checked="true"]:enabled:active) .control {
        background: ${accentFillActive};
        border-color: ${accentFillActive};
    }
    :host([aria-checked="true"]:enabled:${focusVisible}) .control {
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
    slot[name="checked-indicator"],
    slot[name="indeterminate-indicator"] {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
    }
    slot[name="checked-indicator"] {
        fill: ${foregroundOnAccentRest};
    }
    slot[name="indeterminate-indicator"] {
        fill: ${neutralForegroundActive};
        position: absolute;
        top: 0;
    }
    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${disabledCursor};
    }
    :host([aria-checked="true"]:not(.indeterminate)) slot[name='checked-indicator'],
    :host([aria-checked="true"].indeterminate) slot[name='indeterminate-indicator'] {
        opacity: 1;
    }
    :host(.disabled) {
        opacity: ${disabledOpacity};
    }
    :host([aria-checked="true"].indeterminate) .control {
        background: ${neutralFillInputActive};
        border-color: ${strokeControlStrongRest};
    }
    :host([aria-checked="true"].indeterminate:hover) .control {
        background: ${neutralFillInputActive};
        border-color: ${strokeControlStrongHover};
    }
    :host([aria-checked="true"].indeterminate:active) .control {
        background: ${neutralFillInputActive};
        border-color: ${strokeControlStrongActive};
    }
    :host([aria-checked="true"].indeterminate:${focusVisible}) .control {
        background: ${neutralFillInputActive};
        border-color: ${strokeControlStrongFocus};
        box-shadow: 0 0 0 calc(${strokeWidth} * 1px) ${neutralFillInputRest},
        0 0 0 calc(${focusStrokeWidth} * 1px) ${strokeControlStrongFocus};
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .control {
                    border-color: ${SystemColors.FieldText};
                    background: ${SystemColors.Field};
                }
                slot[name='checked-indicator'],
                slot[name='indeterminate-indicator'] {
                    fill: ${SystemColors.FieldText};
                }
                :host(:enabled:hover) .control,
                :host(:enabled:active) .control {
                    border-color: ${SystemColors.Highlight};
                    background: ${SystemColors.Field};
                }
                :host(:enabled:${focusVisible}) .control,
                :host(.checked:enabled:${focusVisible}) .control {
                forced-color-adjust: none;
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.FieldText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.FieldText};
                }
                :host(.checked) .control {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                }
                :host(.checked:enabled:hover) .control,
                :host(.checked:enabled:active) .control {
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.Highlight}
                }
                :host(.checked) slot[name='checked-indicator'],
                :host(.checked) slot[name='indeterminate-indicator'] {
                    fill: ${SystemColors.HighlightText};
                }
                :host(.checked:enabled:hover) slot[name='checked-indicator'],
                :host(.checked:enabled:${focusVisible}) slot[name='checked-indicator'],
                :host(.checked:enabled:hover) slot[name='indeterminate-indicator'],
                :host(.checked:enabled:${focusVisible}) slot[name='indeterminate-indicator'] {
                    fill: ${SystemColors.Highlight};
                }
                :host(.disabled) {
                    opacity: 1;
                }
                :host(.disabled) .label {
                    color: ${SystemColors.GrayText};
                }
                :host(.disabled) .control {
                    border-color: ${SystemColors.GrayText};
                    background: ${SystemColors.Field};
                }
                :host(.disabled) slot[name='indeterminate-indicator'],
                :host(.checked.disabled) .control:hover slot[name='indeterminate-indicator'] {
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                }
                :host(.disabled) slot[name='checked-indicator'],
                :host(.checked.disabled) .control:hover slot[name='checked-indicator'] {
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                }
            `
        )
    );
