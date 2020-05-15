import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    heightNumber,
    neutralFocusBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "../../styles";

export const TabStyles = css`
    ${display("inline-flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${
            /* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""
        } font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        height: calc(${heightNumber} * 1px);
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
        color: var(--neutral-foreground-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
    }

    :host([aria-selected="true"]) {
        z-index: 2;
    }

    :host(:hover) {
        color: var(--neutral-foreground-hover);
    }

    :host(:active) {
        color: var(--neutral-foreground-active);
    }

    :host(:${focusVisible}) {
        outline: none;
        border: calc(var(--outline-width) * 1px) solid var(--neutral-focus);
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px)
            var(--neutral-focus);
    }

    :host(:focus) {
        outline: none;
    }

    :host(.vertical) {
        justify-content: end;
        grid-column: 2
    }

    :host(.vertical[aria-selected="true"]) {
        z-index: 2;
    }

    :host(.vertical:hover) {
        color: var(--neutral-foreground-hover);
    }

    :host(.vertical:active) {
        color: var(--neutral-foreground-active);
    }

    :host(.vertical:hover[aria-selected="true"]) {
    }
`.withBehaviors(
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundActiveBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host {
                forced-color-adjust: none;
                border-color: transparent;
                color: ${SystemColors.ButtonText};
            }
            :host(:hover),
            :host(.vertical:hover) {
                color: ${SystemColors.ButtonText};
            }
            :host(:${focusVisible}) {
                border-color: ${SystemColors.ButtonText};
                box-shadow: none;
            }
        `
    )
);
