import { css } from "@microsoft/fast-element";
import { disabledCursor, display } from "../styles";
import { focusVisible } from "../styles/focus";
import { SystemColors } from "../styles/system-colors";

export const CheckboxStyles = css`
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

    .checkbox {
        position: relative;
        width: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        height: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid var(--neutral-outline-rest);
        background: var(--neutral-fill-input-rest);
        outline: none;
        cursor: pointer;
    }

    .label {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
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
        width: 100%;
        height: 100%;
        display: block;
        fill: var(--neutral-foreground-rest);
        opacity: 0;
        pointer-events: none;
    }

    .indeterminate-indicator {
        border-radius: calc(var(--corner-radius) * 1px);
        background: var(--neutral-foreground-rest);
        position: absolute;
        top: 25%;
        right: 25%;
        bottom: 25%;
        left: 25%;
        opacity: 0;
    }

    .checkbox:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-outline-hover);
    }

    :host(:${focusVisible}) .checkbox {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .checkbox,
    :host(.disabled) .checkbox {
        cursor: ${disabledCursor};
    }

    :host(.checked:not(.indeterminate)) .checked-indicator,
    :host(.indeterminate) .indeterminate-indicator {
        opacity: 1;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    @media (forced-colors: active) {
        .checkbox, .checkbox:hover, .checkbox:active {
            forced-color-adjust: none;
            border-color: ${SystemColors.FieldText};
            background: ${SystemColors.Field};
        }
        
        .checked-indicator {
            fill: ${SystemColors.FieldText};
        }

        .indeterminate-indicator  {
            background: ${SystemColors.FieldText};
        }
        
        :host(:${focusVisible}) .checkbox {
            border-color: ${SystemColors.Highlight};
        }

        :host(.disabled) {
            opacity: 1;
        }

        :host(.disabled) .checkbox {
            forced-color-adjust: none;
            border-color: ${SystemColors.GrayText};
        }

        :host(.disabled) .indeterminate-indicator {
            forced-color-adjust: none;
            background: ${SystemColors.GrayText};
        }

        :host(.disabled) .checked-indicator {
            forced-color-adjust: none;
            fill: ${SystemColors.GrayText};
        }
    }
`;
