import { css } from "@microsoft/fast-element";
import {
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFocusBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
} from "@microsoft/fast-components";
import { heightNumber } from "@microsoft/fast-components/dist/esm/styles/size";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    display,
    forcedColorsStylesheetBehavior,
    focusVisible,
    disabledCursor,
} from "@microsoft/fast-foundation";
import { neutralForegroundRestBehavior } from "@microsoft/fast-components";

export const ColorSwatchStyles = css`
${display("inline-flex")} :host {
    --input-size: calc((${heightNumber} / 2) + var(--design-unit));
    align-items: center;
    outline: none;
    margin: calc(var(--design-unit) * 1px) 0;
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
    width: calc(var(--input-size) * 1px);
    height: calc(var(--input-size) * 1px);
    box-sizing: border-box;
    border-radius: calc(var(--corner-radius) * 1px);
    border: calc(var(--outline-width) * 1px) solid ${neutralOutlineRestBehavior.var};
    outline: none;
    cursor: pointer;
}

.label-hidden {
    display: none;
}

.label {
    font-family: var(--body-font);
    color: ${neutralForegroundRestBehavior.var};
    ${
        /* Need to discuss with Brian how HorizontalSpacingNumber can work. https://github.com/microsoft/fast-dna/issues/2766 */ ""
    } padding-inline-start: calc(var(--design-unit) * 2px + 2px);
    margin-inline-end: calc(var(--design-unit) * 2px + 2px);
    cursor: pointer;
    ${
        /* Font size is temporary - replace when adaptive typography is figured out */ ""
    } font-size: calc(1rem + (var(--density) * 2px));
}

.checked-indicator {
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: calc(var(--corner-radius) * 1px);
    display: inline-block;
    flex-shrink: 0;
    border: 1px solid ${neutralForegroundRestBehavior.var};
    opacity: 0;
    pointer-events: none;
}

.control:hover {
    border-color: ${neutralOutlineHoverBehavior.var};
}

:host(:${focusVisible}) .control {
    box-shadow: 0 0 0 1px ${neutralFocusBehavior.var} inset;
    border-color: ${neutralFocusBehavior.var};
}

:host(.disabled) .label,
:host(.readonly) .label,
:host(.readonly) .control,
:host(.disabled) .control {
    cursor: ${disabledCursor};
}

:host(.checked) .checked-indicator {
    opacity: 1;
}

:host(.disabled) {
    opacity: var(--disabled-opacity);
}
`.withBehaviors(
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineHoverBehavior,
    neutralOutlineRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
        .control, .control:hover, .control:active {
            forced-color-adjust: none;
            border-color: ${SystemColors.FieldText};
            background: ${SystemColors.Field};
        }
        :host(:${focusVisible}) .control {
            border-color: ${SystemColors.Highlight};
        }
        :host(.checked) .control:hover, .control:active {
            border-color: ${SystemColors.Highlight};
            background: ${SystemColors.Highlight};
        }
        :host(.checked) .checked-indicator {
            background: ${SystemColors.Highlight};
            fill: ${SystemColors.Highlight};
        }
        :host(.checked) .control:hover .checked-indicator {
            background: ${SystemColors.HighlightText};
            fill: ${SystemColors.HighlightText};
        }
        :host(.disabled) {
            forced-color-adjust: none;
            opacity: 1;
        }
        :host(.disabled) .label {
            color: ${SystemColors.GrayText};
        }
        :host(.disabled) .control,
        :host(.checked.disabled) .control:hover, .control:active {
            background: ${SystemColors.Field};
            border-color: ${SystemColors.GrayText};
        }
        :host(.disabled) .checked-indicator,
        :host(.checked.disabled) .control:hover .checked-indicator {
            fill: ${SystemColors.GrayText};
            background: ${SystemColors.GrayText};
        }
    `
    )
);
