import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineActiveBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
} from "@microsoft/fast-components";
// update the below imports once #3091 is merged
import { SystemColors } from "@microsoft/fast-components/dist/styles/system-colors";
import { heightNumber } from "@microsoft/fast-components/dist/styles/size";
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-components/dist/styles/match-media-stylesheet-behavior";

export const SwitchStyles = css`
    :host([hidden]) {
        display: none;
    }

    ${display("inline-flex")} :host {
        align-items: center;
        outline: none;
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

    .switch:hover {
        cursor: pointer;
    }

    .switch:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    .switch:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-outline-active);
    }

    :host(:${focusVisible}) .switch {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
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
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        ${
            /* Font size is temporary - replace when adaptive typography is figured out */ ""
        } font-size: calc(1rem + (var(--density) * 2px));
    }

    .label {
        color: var(--neutral-foreground-rest);

        ${
            /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast-dna/issues/2766 */ ""
        } margin-inline-end: calc(var(--design-unit) * 2px + 2px);
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
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
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
