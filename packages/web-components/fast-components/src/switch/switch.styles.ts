import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    SwitchOptions,
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
import { DirectionalStyleSheetBehavior, heightNumber } from "../styles/index";

export const switchStyles: (
    context: ElementDefinitionContext,
    definition: SwitchOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: SwitchOptions) =>
    css`
    :host([hidden]) {
        display: none;
    }

    ${display("inline-flex")} :host {
        align-items: center;
        outline: none;
        font-family: ${bodyFont};
        margin: calc(${designUnit} * 1px) 0;
        ${
            /*
             * Chromium likes to select label text or the default slot when
             * the checkbox is clicked. Maybe there is a better solution here?
             */ ""
        } user-select: none;
    }

    :host([disabled]) {
        opacity: ${disabledOpacity};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .switch,
    :host([disabled]) .switch {
        cursor: ${disabledCursor};
    }

    .switch {
        position: relative;
        outline: none;
        box-sizing: border-box;
        width: calc(${heightNumber} * 1px);
        height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        background: ${neutralFillInputRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
    }

    .switch:hover {
        background: ${neutralFillInputHover};
        border-color: ${neutralStrokeHover};
        cursor: pointer;
    }

    host([disabled]) .switch:hover,
    host([readonly]) .switch:hover {
        background: ${neutralFillInputHover};
        border-color: ${neutralStrokeHover};
        cursor: ${disabledCursor};
    }

    :host(:not([disabled])) .switch:active {
        background: ${neutralFillInputActive};
        border-color: ${neutralStrokeActive};
    }

    :host(:${focusVisible}) .switch {
        box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        bottom: 5px;
        background: ${neutralForegroundRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        transition: all 0.2s ease-in-out;
    }

    .status-message {
        color: ${neutralForegroundRest};
        cursor: pointer;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
    }

    :host([disabled]) .status-message,
    :host([readonly]) .status-message {
        cursor: ${disabledCursor};
    }

    .label {
        color: ${neutralForegroundRest};

        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */ ""
        } margin-inline-end: calc(${designUnit} * 2px + 2px);
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    ::slotted(*) {
        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */ ""
        } margin-inline-start: calc(${designUnit} * 2px + 2px);
    }

    :host([aria-checked="true"]) .checked-indicator {
        background: ${foregroundOnAccentRest};
    }

    :host([aria-checked="true"]) .switch {
        background: ${accentFillRest};
        border-color: ${accentFillRest};
    }

    :host([aria-checked="true"]:not([disabled])) .switch:hover {
        background: ${accentFillHover};
        border-color: ${accentFillHover};
    }

    :host([aria-checked="true"]:not([disabled])) .switch:active {
        background: ${accentFillActive};
        border-color: ${accentFillActive};
    }

    :host([aria-checked="true"]:${focusVisible}:not([disabled])) .switch {
        box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
    }

    .unchecked-message {
        display: block;
    }

    .checked-message {
        display: none;
    }

    :host([aria-checked="true"]) .unchecked-message {
        display: none;
    }

    :host([aria-checked="true"]) .checked-message {
        display: block;
    }
`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
            .checked-indicator,
            :host(:not([disabled])) .switch:active .checked-indicator {
                forced-color-adjust: none;
                background: ${SystemColors.FieldText};
            }
            .switch {
                forced-color-adjust: none;
                background: ${SystemColors.Field};
                border-color: ${SystemColors.FieldText};
            }
            :host(:not([disabled])) .switch:hover {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]) .switch {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover,
            :host(:not([disabled])) .switch:active {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
            }
            :host([aria-checked="true"]) .checked-indicator {
                background: ${SystemColors.HighlightText};
            }
            :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
                background: ${SystemColors.Highlight};
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host(:${focusVisible}) .switch {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([aria-checked="true"]:${focusVisible}:not([disabled])) .switch {
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
            :host([disabled]) .checked-indicator {
                background: ${SystemColors.GrayText};
            }
            :host([disabled]) .switch {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.GrayText};
            }
        `
        ),
        new DirectionalStyleSheetBehavior(
            css`
                .checked-indicator {
                    left: 5px;
                    right: calc(((${heightNumber} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    left: calc(((${heightNumber} / 2) + 1) * 1px);
                    right: 5px;
                }
            `,
            css`
                .checked-indicator {
                    right: 5px;
                    left: calc(((${heightNumber} / 2) + 1) * 1px);
                }

                :host([aria-checked="true"]) .checked-indicator {
                    right: calc(((${heightNumber} / 2) + 1) * 1px);
                    left: 5px;
                }
            `
        )
    );
