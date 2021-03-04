import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillRestBehavior,
    heightNumber,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
    neutralLayerL2Behavior,
    neutralLayerL3Behavior,
} from "../styles/index";

export const MenuItemStyles = css`
    ${display("grid")} :host {
        contain: layout;
        overflow: visible;
        font-family: var(--body-font);
        outline: none;
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        grid-template-columns: minmax(42px, auto) 1fr minmax(42px, auto);
        grid-template-rows: auto;
        justify-items: center;
        align-items: center;
        padding: 0;
        margin: 0 calc(var(--design-unit) * 1px);
        white-space: nowrap;
        color: ${neutralForegroundRestBehavior.var};
        fill: currentcolor;
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--focus-outline-width) * 1px) solid transparent;
    }

    :host(:${focusVisible}) {
        border-color: ${neutralFocusBehavior.var};
        background: ${neutralLayerL3Behavior.var};
        color: ${neutralForegroundRestBehavior.var};
    }

    :host(:hover) {
        background: ${neutralLayerL3Behavior.var};
        color: ${neutralForegroundHoverBehavior.var};
    }

    :host([aria-checked="true"]),
    :host(:active),
    :host(.expanded) {
        background: ${neutralLayerL2Behavior.var};
        color: ${neutralForegroundRestBehavior.var};
    }

    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: var(--disabled-opacity);
    }

    :host([disabled]:hover) {
        color: ${neutralForegroundRestBehavior.var};
        fill: currentcolor;
        background: ${neutralFillStealthRestBehavior.var}
    }

    :host([disabled]:hover) .start,
    :host([disabled]:hover) .end,
    :host([disabled]:hover)::slotted(svg) {
        fill: ${neutralForegroundRestBehavior.var};
    }

    .content {
        grid-column-start: 2;
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .start,
    .end {
        display: flex;
        justify-content: center;
    }
    
    ::slotted(svg) {
        ${
            /* Glyph size and margin-left is temporary - 
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
    }

    :host(:hover) .start,
    :host(:hover) .end,
    :host(:hover)::slotted(svg),
    :host(:active) .start,
    :host(:active) .end,
    :host(:active)::slotted(svg) {
        fill: ${neutralForegroundRestBehavior.var};
    }

    :host([role="menuitemcheckbox"]),
    :host([role="menuitemradio"]) {
        display: grid;
        grid-template-columns: auto auto 1fr minmax(42px, auto);
        align-items: center;
        min-height: 32px;
    }

    :host .input-container {
        display: none;
    }

    :host([role="menuitemcheckbox"]) .input-container,
    :host([role="menuitemradio"]) .input-container {
        display: grid;
        margin-inline-end: 10px;
    }

    :host([role="menuitemcheckbox"]) .start,
    :host([role="menuitemradio"]) .start {
        grid-column-start: 2;
        margin-inline-end: 10px;
    }

    :host([role="menuitemcheckbox"]) .content,
    :host([role="menuitemradio"]) .content {
        grid-column-start: 3;
    }

    :host([role="menuitemcheckbox"]) .end,
    :host([role="menuitemradio"]) .end {
        grid-column-start: 4;
    }

    :host .checkbox,
    :host .radio {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 20px;
        height: 20px;
        box-sizing: border-box;
        border: calc(var(--outline-width) * 1px) solid ${
            neutralForegroundRestBehavior.var
        };
        outline: none;
        margin-inline-start: 10px;
    }

    :host([aria-checked="true"]) .checkbox,
    :host([aria-checked="true"]) .radio {
        background: ${accentFillRestBehavior.var};
        border-color: ${accentFillRestBehavior.var};
    }

    :host .checkbox {
        border-radius: calc(var(--corner-radius) * 1px);
    }

    :host .radio {
        border-radius: 999px;
    }

    :host .checkbox-indicator,
    :host .radio-indicator,
    ::slotted([slot="checkbox-indicator"]),
    ::slotted([slot="radio-indicator"]) {
        display: none;
    }

    :host([aria-checked="true"]) .checkbox-indicator,
    :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]) {
        width: 100%;
        height: 100%;
        display: block;
        fill: ${neutralForegroundRestBehavior.var};
        pointer-events: none;
    }

    :host([aria-checked="true"]) .radio-indicator {
        position: absolute;
        top: 4px;
        left: 4px;
        right: 4px;
        bottom: 4px;
        border-radius: 999px;
        display: block;
        background: ${neutralForegroundRestBehavior.var};
        pointer-events: none;
    }

    :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
        display: block;
        pointer-events: none;
    }
`.withBehaviors(
    accentFillRestBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
    neutralLayerL2Behavior,
    neutralLayerL3Behavior,
    forcedColorsStylesheetBehavior(
        css`
            :host {
                border-color: transparent;
                color: ${SystemColors.ButtonText};
                forced-color-adjust: none;
            }

            :host(:hover) {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host(:hover) .start,
            :host(:hover) .end,
            :host(:hover)::slotted(svg),
            :host(:active) .start,
            :host(:active) .end,
            :host(:active)::slotted(svg) {
                fill: ${SystemColors.HighlightText};
            }

            :host(.expanded) {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host(:${focusVisible}) {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${SystemColors.HighlightText};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }

            :host([disabled]),
            :host([disabled]:hover),
            :host([disabled]:hover) .start,
            :host([disabled]:hover) .end,
            :host([disabled]:hover)::slotted(svg) {
                background: ${SystemColors.Canvas};
                color: ${SystemColors.GrayText};
                fill: currentcolor;
                opacity: 1;
            }

            :host .checkbox,
            :host .radio{
                border-color: ${SystemColors.ButtonText};
                background: ${SystemColors.HighlightText};
            }

            :host([checked="true"]) .checkbox,
            :host([checked="true"]) .radio {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.HighlightText};
            }

            :host(:hover) .checkbox,
            :host(:hover) .radio,
            :host(:${focusVisible}) .checkbox,
            :host(:${focusVisible}) .radio,
            :host([checked="true"]:hover) .checkbox,
            :host([checked="true"]:hover) .radio,
            :host([checked="true"]:${focusVisible}) .checkbox,
            :host([checked="true"]:${focusVisible}) .radio {
                border-color: ${SystemColors.HighlightText};
            }

            :host([aria-checked="true"]) {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host([aria-checked="true"]) .checkbox-indicator,
            :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]),
            :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
                fill: ${SystemColors.Highlight};
            }

            :host([aria-checked="true"]) .radio-indicator {
                background: ${SystemColors.Highlight};
            }
        `
    )
);
