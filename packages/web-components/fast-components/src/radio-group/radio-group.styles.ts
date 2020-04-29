import { css } from "@microsoft/fast-element";
import { display } from "../styles";
import { focusVisible } from "../styles/focus";
import { SystemColors } from "../styles/system-colors";
import { heightNumber } from "../styles/size";
import { forcedColorsStylesheetBehavior } from "../styles/match-media-stylesheet-behavior";

export const RadioGroupStyles = css`
    ${display("inline-flex")} :host {
        --input-size: calc((${heightNumber} / 2) + var(--design-unit));
        align-items: center;
        outline: none;
        margin: calc(var(--design-unit) * 1px) 0;
        user-select: none;
        position: relative;
        flex-direction: row;
    }

    :host(:${focusVisible}) {
        box-shadow: 0 0 0 1px var(--neutral-focus) inset;
        border-color: var(--neutral-focus);
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host(:${focusVisible}) {
                border-color: ${SystemColors.Highlight};
            }
    
            :host(.disabled) {
                opacity: 1;
            }
    
            :host(.disabled) {
                forced-color-adjust: none;
                border-color: ${SystemColors.GrayText};
            }
        `
    )
);
