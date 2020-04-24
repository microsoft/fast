import { css } from "@microsoft/fast-element";
import { disabledCursor, display } from "../styles";
import { focusVisible } from "../styles/focus";
import { SystemColors } from "../styles/system-colors";
import { heightNumber } from "../styles/size";

export const RadioGroupStyles = css`
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
        box-sizing: border-box;
        outline: none;
        cursor: pointer;
    }

    :host(:${focusVisible}) .control {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }

    @media (forced-colors: active) {  
        :host(:${focusVisible}) .control {
            border-color: ${SystemColors.Highlight};
        }

        :host(.disabled) {
            opacity: 1;
        }

        :host(.disabled) .control {
            forced-color-adjust: none;
            border-color: ${SystemColors.GrayText};
        }
    }
`;
