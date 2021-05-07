import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    disabledOpacity,
    focusOutlineWidth,
    neutralFillStealthRest,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForegroundRest,
    neutralOutlineRest,
    outlineWidth,
} from "../design-tokens";
import { heightNumber, neutralFocusInnerAccentBehavior } from "../styles/index";

export const flipperStyles = (context, definition) =>
    css`
    ${display("inline-flex")} :host {
        width: calc(${heightNumber} * 1px);
        height: calc(${heightNumber} * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        position: relative;
        fill: currentcolor;
        color: ${accentForegroundCut};
        background: transparent;
        outline: none;
        border: none;
        padding: 0;
    }

    :host::before {
        content: "";
        background: ${accentFillRest};
        border: calc(${outlineWidth} * 1px) solid ${accentFillRest};
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        transition: all 0.1s ease-in-out;
    }

    .next,
    .previous {
        position: relative;
        ${
            /* Glyph size and display: grid are temporary - 
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
        display: grid;
    }

    :host([disabled]) {
        opacity: ${disabledOpacity};
        cursor: ${disabledCursor};
        fill: currentcolor;
        color: ${neutralForegroundRest};
    }

    :host([disabled])::before,
    :host([disabled]:hover)::before,
    :host([disabled]:active)::before {
        background: ${neutralFillStealthRest};
        border: calc(${outlineWidth} * 1px) solid ${neutralOutlineRest};
    }

    :host(:hover)::before {
        background: ${accentFillHover};
        border-color: ${accentFillHover};
    }

    :host(:active)::before {
        background: ${accentFillActive};
        border-color: ${accentFillActive};
    }

    :host(:${focusVisible}) {
        outline: none;
    }

    :host(:${focusVisible})::before {
        box-shadow: 0 0 0 calc(${focusOutlineWidth} * 1px) inset ${neutralFocusInnerAccent};
        border-color: ${neutralFocus};
    }

    :host::-moz-focus-inner {
        border: 0;
    }
`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
            :host {
                background: ${SystemColors.Canvas};
            }
            :host .next,
            :host .previous {
                color: ${SystemColors.ButtonText};
                fill: currentcolor;
            }
            :host::before {
                background: ${SystemColors.Canvas};
                border-color: ${SystemColors.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous  {
                forced-color-adjust: none;
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled])::before,
            :host([disabled]:hover)::before,
            :host([disabled]) .next,
            :host([disabled]) .previous {
                forced-color-adjust: none;
                background: ${SystemColors.Canvas};
                border-color: ${SystemColors.GrayText};
                color: ${SystemColors.GrayText};
                fill: ${SystemColors.GrayText};
            }
            :host(:${focusVisible})::before {
                forced-color-adjust: none;
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
            }
        `
        )
    );
