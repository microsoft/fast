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
} from "../../styles/index";

export const CarouselSlideStyles = css`
    ${display("inline-flex")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        height: calc(${heightNumber} * 1px);
        padding: calc(var(--design-unit) * 5px) calc(var(--design-unit) * 4px);
        color: ${neutralForegroundHintBehavior.var};
        fill: ${neutralForegroundHintBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
    }

    :host(:hover) {
        color: ${neutralForegroundHoverBehavior.var};
        fill: ${neutralForegroundHoverBehavior.var};
    }

    :host(:active) {
        color: ${neutralForegroundActiveBehavior.var};
        fill: ${neutralForegroundActiveBehavior.var};
    }

    :host([aria-selected="true"]) {
        background: ${neutralFillRestBehavior.var};
        color: ${accentForegroundRestBehavior.var};
        fill: ${accentFillRestBehavior.var};
    }

    :host([aria-selected="true"]:hover) {
        background: ${neutralFillHoverBehavior.var};
        color: ${accentForegroundHoverBehavior.var};
        fill: ${accentFillHoverBehavior.var};
    }

    :host([aria-selected="true"]:active) {
        background: ${neutralFillActiveBehavior.var};
        color: ${accentForegroundActiveBehavior.var};
        fill: ${accentFillActiveBehavior.var};
    }

    :host(:${focusVisible}) {
        outline: none;
        border: calc(var(--outline-width) * 1px) solid ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px)
            ${neutralFocusBehavior.var};
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
        color: ${neutralForegroundHoverBehavior.var};
    }

    :host(.vertical:active) {
        color: ${neutralForegroundActiveBehavior.var};
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
                fill: ${SystemColors.ButtonText};
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: ${SystemColors.HighlightText};
            }
            :host([aria-selected="true"]) {
                background: ${SystemColors.HighlightText};
                color: ${SystemColors.Highlight};
                fill: ${SystemColors.Highlight};
            }
            :host(:${focusVisible}) {
                border-color: ${SystemColors.ButtonText};
                box-shadow: none;
            }
        `
    )
);
