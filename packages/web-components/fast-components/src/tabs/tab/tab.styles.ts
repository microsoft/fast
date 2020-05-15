import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    heightNumber,
    neutralFillActiveBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundHintBehavior,
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
        padding: calc(var(--design-unit) * 5px) calc(var(--design-unit) * 4px);
        color: var(--neutral-foreground-hint);
        fill: var(--neutral-foreground-hint);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
    }

    :host(:hover) {
        color: var(--neutral-foreground-hover);
        fill: var(--neutral-foreground-hover);
    }

    :host(:active) {
        color: var(--neutral-foreground-active);
        fill: var(--neutral-foreground-active);
    }

    :host([aria-selected="true"]) {
        z-index: 2;
        background: var(--neutral-fill-rest);
        color: var(--accent-foreground-rest);
        fill: var(--accent-fill-rest);
    }

    :host([aria-selected="true"]:hover) {
        z-index: 2;
        background: var(--neutral-fill-hover);
        color: var(--accent-foreground-hover);
        fill: var(--accent-fill-hover);
    }

    :host([aria-selected="true"]:active) {
        z-index: 2;
        background: var(--neutral-fill-active);
        color: var(--accent-foreground-active);
        fill: var(--accent-fill-active);
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
        grid-column: 2;
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
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralFillActiveBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
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
