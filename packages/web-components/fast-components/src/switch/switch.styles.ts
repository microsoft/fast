import { css } from "@microsoft/fast-element";
import {
    DirectionalStyleSheetBehavior,
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    heightNumber,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineActiveBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

export const SwitchStyles = css`
    :host([hidden]) {
        display: none;
    }

    ${display("inline-flex")} :host {
        align-items: center;
        outline: none;
        font-family: var(--body-font);
        margin: calc(var(--design-unit) * 1px) 0;
        ${
            /*
             * Chromium likes to select label text or the default slot when
             * the checkbox is clicked. Maybe there is a better solution here?
             */ ""
        } user-select: none;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
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
        height: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        background: ${neutralFillInputRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid ${neutralOutlineRestBehavior.var};
    }

    .switch:hover {
        background: ${neutralFillInputHoverBehavior.var};
        border-color: ${neutralOutlineHoverBehavior.var};
        cursor: pointer;
    }

    host([disabled]) .switch:hover,
    host([readonly]) .switch:hover {
        background: ${neutralFillInputHoverBehavior.var};
        border-color: ${neutralOutlineHoverBehavior.var};
        cursor: ${disabledCursor};
    }

    :host(:not([disabled])) .switch:active {
        background: ${neutralFillInputActiveBehavior.var};
        border-color: ${neutralOutlineActiveBehavior.var};
    }

    :host(:${focusVisible}) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px ${
            neutralFocusBehavior.var
        };
        border-color: ${neutralFocusBehavior.var};
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        bottom: 5px;
        background: ${neutralForegroundRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        transition: all 0.2s ease-in-out;
    }

    .status-message {
        color: ${neutralForegroundRestBehavior.var};
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    :host([disabled]) .status-message,
    :host([readonly]) .status-message {
        cursor: ${disabledCursor};
    }

    .label {
        color: ${neutralForegroundRestBehavior.var};

        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */ ""
        } margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    ::slotted(*) {
        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast/issues/2766 */ ""
        } margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host([aria-checked="true"]) .checked-indicator {
        background: ${accentForegroundCutRestBehavior.var};
    }

    :host([aria-checked="true"]) .switch {
        background: ${accentFillRestBehavior.var};
        border-color: ${accentFillRestBehavior.var};
    }

    :host([aria-checked="true"]:not([disabled])) .switch:hover {
        background: ${accentFillHoverBehavior.var};
        border-color: ${accentFillHoverBehavior.var};
    }

    :host([aria-checked="true"]:not([disabled])) .switch:active {
        background: ${accentFillActiveBehavior.var};
        border-color: ${accentFillActiveBehavior.var};
    }

    :host([aria-checked="true"]:${focusVisible}:not([disabled])) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px ${
            neutralFocusBehavior.var
        };
        border-color: transparent;
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
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineActiveBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
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
