import { css } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
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
} from "../styles";

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

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .switch,
    :host(.disabled) .switch {
        cursor: ${disabledCursor};
    }

    .switch {
        position: relative;
        outline: none;
        box-sizing: border-box;
        width: calc(((${heightNumber} / 2) + var(--design-unit)) * 2px);
        height: calc(((${heightNumber} / 2) + var(--design-unit)) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(${heightNumber} * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
    }

    :host(:enabled) .switch:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
        cursor: pointer;
    }

    :host(:enabled) .switch:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-outline-active);
    }

    :host(:${focusVisible}) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: var(--neutral-focus);
    }

    .checked-indicator {
        position: absolute;
        height: calc((${heightNumber} - (var(--design-unit) * 5.5)) * 1px);
        width: calc((${heightNumber} - (var(--design-unit) * 5.5)) * 1px);
        top: calc(var(--design-unit) * 1px);
        left: calc(var(--design-unit) * 1px);
        background: var(--neutral-foreground-rest);
        border-radius: 50%;
        transition: all 0.2s ease-in-out;
    }

    .status-message {
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        color: var(--neutral-foreground-rest);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    ::slotted(*) {
        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast-dna/issues/2766 */ ""
        } margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host(.checked) .checked-indicator {
        left: calc((((${heightNumber} / 2) + var(--design-unit)) + var(--design-unit)) * 1px);
        background: var(--accent-foreground-cut-rest);
    }

    :host(.checked) .switch {
        background: var(--accent-fill-rest);
    }

    :host(.checked:enabled) .switch:hover {
        background: var(--accent-fill-hover);
    }

    :host(.checked:enabled) .switch:active {
        background: var(--accent-fill-active);
    }

    :host(.checked:${focusVisible}:enabled) .switch {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px var(--neutral-focus);
        border-color: transparent;
    }

    .unchecked-message {
        display: block;
    }

    .checked-message {
        display: none;
    }

    :host(.checked) .unchecked-message {
        display: none;
    }

    :host(.checked) .checked-message {
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
            .checked-indicator {
                forced-color-adjust: none;
                background: ${SystemColors.FieldText};
            }
            .switch, .switch:hover, .switch:active {
                forced-color-adjust: none;
                background: ${SystemColors.Field};
                border-color: ${SystemColors.FieldText};
            }
            :host(.checked) .switch {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${SystemColors.HighlightText};
            }
            :host(.disabled) {
                opacity: 1;
            }
            :host(:${focusVisible}) .switch {
                border-color: ${SystemColors.Highlight};
            }
            :host(.checked:${focusVisible}) .switch {
                border-color: ${SystemColors.FieldText};
                box-shadow: 0 0 0 2px ${SystemColors.Field} inset;
            }
            :host(.disabled) .checked-indicator {
                background: ${SystemColors.GrayText};
            }
            :host(.disabled) .switch {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.GrayText};
            }
        `
    )
);
