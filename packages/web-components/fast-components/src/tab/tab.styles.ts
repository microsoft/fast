import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    bodyFont,
    cornerRadius,
    designUnit,
    disabledOpacity,
    focusOutlineWidth,
    neutralFillStealthRest,
    outlineWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import {
    heightNumber,
    neutralFillActiveBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "../styles";

export const tabStyles = (context, definition) =>
    css`
    ${display("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        height: calc(${heightNumber} * 1px);
        padding: calc(${designUnit} * 5px) calc(${designUnit} * 4px);
        color: ${neutralForegroundHintBehavior.var};
        fill: currentcolor;
        border-radius: calc(${cornerRadius} * 1px);
        border: calc(${outlineWidth} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host(:hover) {
        color: ${neutralForegroundHoverBehavior.var};
        fill: currentcolor;
    }

    :host(:active) {
        color: ${neutralForegroundActiveBehavior.var};
        fill: currentcolor;
    }

    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: ${disabledOpacity};
    }

    :host([disabled]:hover) {
        color: ${neutralForegroundHintBehavior.var};
        background: ${neutralFillStealthRest};
    }

    :host([aria-selected="true"]) {
        background: ${neutralFillRestBehavior.var};
        color: ${accentForegroundRest};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:hover) {
        background: ${neutralFillHoverBehavior.var};
        color: ${accentForegroundHover};
        fill: currentcolor;
    }

    :host([aria-selected="true"]:active) {
        background: ${neutralFillActiveBehavior.var};
        color: ${accentForegroundActive};
        fill: currentcolor;
    }

    :host(:${focusVisible}) {
        outline: none;
        border: calc(${outlineWidth} * 1px) solid ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 calc((${focusOutlineWidth} - ${outlineWidth}) * 1px)
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
                fill: currentcolor;
            }
            :host(:hover),
            :host(.vertical:hover),
            :host([aria-selected="true"]:hover) {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }
            :host([aria-selected="true"]) {
                background: ${SystemColors.HighlightText};
                color: ${SystemColors.Highlight};
                fill: currentcolor;
            }
            :host(:${focusVisible}) {
                border-color: ${SystemColors.ButtonText};
                box-shadow: none;
            }
        `
        )
    );
