import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../size";
import {
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralFillActiveBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
} from "../recipes";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    bodyFont,
    cornerRadius,
    density,
    designUnit,
    focusOutlineWidth,
    outlineWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../../design-tokens";

/**
 * @internal
 */
export const BaseButtonStyles = css`
    ${display("inline-flex")} :host {
        font-family: ${bodyFont};
        outline: none;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        height: calc(${heightNumber} * 1px);
        min-width: calc(${heightNumber} * 1px);
        background-color: ${neutralFillRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
        border-radius: calc(${cornerRadius} * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(${outlineWidth} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${neutralFillHoverBehavior.var};
    }

    :host(:active) {
        background-color: ${neutralFillActiveBehavior.var};
    }

    .control:${focusVisible} {
        border: calc(${outlineWidth} * 1px) solid ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 calc((${focusOutlineWidth} - ${outlineWidth}) * 1px) ${
    neutralFocusBehavior.var
};
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    ::slotted(svg) {
        ${
            /* Glyph size and margin-left is temporary -
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
        pointer-events: none;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`.withBehaviors(
    neutralFillRestBehavior,
    neutralForegroundRestBehavior,
    neutralFillHoverBehavior,
    neutralFillActiveBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host .control {
              background-color: ${SystemColors.ButtonFace};
              border-color: ${SystemColors.ButtonText};
              color: ${SystemColors.ButtonText};
              fill: currentColor;
            }
    
            :host(:hover) .control {
              forced-color-adjust: none;
              background-color: ${SystemColors.Highlight};
              color: ${SystemColors.HighlightText};
            }

            .control:${focusVisible} {
              forced-color-adjust: none;
              background-color: ${SystemColors.Highlight};
              border-color: ${SystemColors.ButtonText};
              box-shadow: 0 0 0 calc((${focusOutlineWidth} - ${outlineWidth}) * 1px) ${SystemColors.ButtonText};
              color: ${SystemColors.HighlightText};
            }

            .control:hover,
            :host([appearance="outline"]) .control:hover {
              border-color: ${SystemColors.ButtonText};
            }

            :host([href]) .control {
                border-color: ${SystemColors.LinkText};
                color: ${SystemColors.LinkText};
            }

            :host([href]) .control:hover,
            :host([href]) .control:${focusVisible}{
              forced-color-adjust: none;
              background: ${SystemColors.ButtonFace};
              border-color: ${SystemColors.LinkText};
              box-shadow: 0 0 0 1px ${SystemColors.LinkText} inset;
              color: ${SystemColors.LinkText};
              fill: currentColor;
            }
        `
    )
);

/**
 * @internal
 */
export const AccentButtonStyles = css`
    :host([appearance="accent"]) {
        background: ${accentFillRest};
        color: ${accentForegroundCut};
    }

    :host([appearance="accent"]:hover) {
        background: ${accentFillHover};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${accentFillActive};
    }

    :host([appearance="accent"]) .control:${focusVisible} {
        box-shadow: 0 0 0 calc(${focusOutlineWidth} * 1px) inset ${neutralFocusInnerAccentBehavior.var};
    }
`.withBehaviors(
    accentForegroundCutRestBehavior,
    neutralFocusInnerAccentBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host([appearance="accent"]) .control:hover {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.Highlight};
            }

            :host([appearance="accent"]) .control:${focusVisible} {
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 2px ${SystemColors.HighlightText} inset;
            }

            :host([appearance="accent"][href]) .control{
                background: ${SystemColors.LinkText};
                color: ${SystemColors.HighlightText};
            }

            :host([appearance="accent"][href]) .control:hover {
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.LinkText};
                box-shadow: none;
                color: ${SystemColors.LinkText};
                fill: currentColor;
            }

            :host([appearance="accent"][href]) .control:${focusVisible} {
                border-color: ${SystemColors.LinkText};
                box-shadow: 0 0 0 2px ${SystemColors.HighlightText} inset;
            }
        `
    )
);

/**
 * @internal
 */
export const HypertextStyles = css`
    :host([appearance="hypertext"]) {
        font-size: inherit;
        line-height: inherit;
        height: auto;
        min-width: 0;
        background: transparent;
    }

    :host([appearance="hypertext"]) .control {
        display: inline;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        line-height: 1;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }
    :host([appearance="hypertext"]) .control:link,
    :host([appearance="hypertext"]) .control:visited {
        background: transparent;
        color: ${accentForegroundRestBehavior.var};
        border-bottom: calc(${outlineWidth} * 1px) solid ${accentForegroundRestBehavior.var};
    }

    :host([appearance="hypertext"]) .control:hover {
        border-bottom-color: ${accentForegroundHoverBehavior.var};
    }

    :host([appearance="hypertext"]) .control:active {
        border-bottom-color: ${accentForegroundActiveBehavior.var};
    }

    :host([appearance="hypertext"]) .control:${focusVisible} {
        border-bottom: calc(${focusOutlineWidth} * 1px) solid ${neutralFocusBehavior.var};
        margin-bottom: calc(calc(${outlineWidth} - ${focusOutlineWidth}) * 1px);
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundActiveBehavior,
    neutralFocusBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host([appearance="hypertext"]:hover) {
                background-color: ${SystemColors.ButtonFace};
                color: ${SystemColors.ButtonText};
            }
            :host([appearance="hypertext"][href]) .control:hover,
            :host([appearance="hypertext"][href]) .control:active,
            :host([appearance="hypertext"][href]) .control:${focusVisible} {
                color: ${SystemColors.LinkText};
                border-bottom-color: ${SystemColors.LinkText};
                box-shadow: none;
            }
        `
    )
);

/**
 * @internal
 */
export const LightweightButtonStyles = css`
    :host([appearance="lightweight"]) {
        background: transparent;
        color: ${accentForegroundRestBehavior.var};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        color: ${accentForegroundHoverBehavior.var};
    }

    :host([appearance="lightweight"]:active) {
        color: ${accentForegroundActiveBehavior.var};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${outlineWidth} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${accentForegroundHoverBehavior.var};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${accentForegroundActiveBehavior.var};
    }

    :host([appearance="lightweight"]) .control:${focusVisible} .content::before {
        background: ${neutralForegroundRestBehavior.var};
        height: calc(${focusOutlineWidth} * 1px);
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host([appearance="lightweight"]) .control:hover,
            :host([appearance="lightweight"]) .control:${focusVisible} {
                forced-color-adjust: none;
                background: ${SystemColors.ButtonFace};
                color: ${SystemColors.Highlight};
            }
            :host([appearance="lightweight"]) .control:hover .content::before,
            :host([appearance="lightweight"]) .control:${focusVisible} .content::before {
                background: ${SystemColors.Highlight};
            }

            :host([appearance="lightweight"][href]) .control:hover,
            :host([appearance="lightweight"][href]) .control:${focusVisible} {
                background: ${SystemColors.ButtonFace};
                box-shadow: none;
                color: ${SystemColors.LinkText};
            }

            :host([appearance="lightweight"][href]) .control:hover .content::before,
            :host([appearance="lightweight"][href]) .control:${focusVisible} .content::before {
                background: ${SystemColors.LinkText};
            }
        `
    )
);

/**
 * @internal
 */
export const OutlineButtonStyles = css`
    :host([appearance="outline"]) {
        background: transparent;
        border-color: ${accentFillRest};
    }

    :host([appearance="outline"]:hover) {
        border-color: ${accentFillHover};
    }

    :host([appearance="outline"]:active) {
        border-color: ${accentFillActive};
    }

    :host([appearance="outline"]) .control {
        border-color: inherit;
    }

    :host([appearance="outline"]) .control:${focusVisible} {
        box-shadow: 0 0 0 calc((${focusOutlineWidth} - ${outlineWidth}) * 1px) ${neutralFocusBehavior.var};
        border-color: ${neutralFocusBehavior.var};
    }
<<<<<<< HEAD
=======

    :host([appearance="outline"][disabled]) {
        border-color: ${accentFillRest};
    }
>>>>>>> add accent-fill design tokens
`.withBehaviors(
    neutralFocusBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host([appearance="outline"]) .control {
                border-color: ${SystemColors.ButtonText};
            }
            :host([appearance="outline"]) .control:${focusVisible} {
              forced-color-adjust: none;
              background-color: ${SystemColors.Highlight};
              border-color: ${SystemColors.ButtonText};
              box-shadow: 0 0 0 calc((${focusOutlineWidth} - ${outlineWidth}) * 1px) ${SystemColors.ButtonText};
              color: ${SystemColors.HighlightText};
              fill: currentColor;
            }
            :host([appearance="outline"][href]) .control {
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.LinkText};
                color: ${SystemColors.LinkText};
                fill: currentColor;
            }
            :host([appearance="outline"][href]) .control:hover,
            :host([appearance="outline"][href]) .control:${focusVisible} {
              forced-color-adjust: none;
              border-color: ${SystemColors.LinkText};
              box-shadow: 0 0 0 1px ${SystemColors.LinkText} inset;
            }
        `
    )
);

/**
 * @internal
 */
export const StealthButtonStyles = css`
    :host([appearance="stealth"]) {
        background: ${neutralFillStealthRestBehavior.var};
    }

    :host([appearance="stealth"]:hover) {
        background: ${neutralFillStealthHoverBehavior.var};
    }

    :host([appearance="stealth"]:active) {
        background: ${neutralFillStealthActiveBehavior.var};
    }
`.withBehaviors(
    neutralFillStealthRestBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthActiveBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host([appearance="stealth"]),
            :host([appearance="stealth"]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.ButtonFace};
                border-color: transparent;
                color: ${SystemColors.ButtonText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:hover) .control {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"]:${focusVisible}) .control {
                background: ${SystemColors.Highlight};
                box-shadow: 0 0 0 1px ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]) .control {
                color: ${SystemColors.LinkText};
            }

            :host([appearance="stealth"][href]:hover) .control,
            :host([appearance="stealth"][href]:${focusVisible}) .control {
                background: ${SystemColors.LinkText};
                border-color: ${SystemColors.LinkText};
                color: ${SystemColors.HighlightText};
                fill: currentColor;
            }

            :host([appearance="stealth"][href]:${focusVisible}) .control {
                forced-color-adjust: none;
                box-shadow: 0 0 0 1px ${SystemColors.LinkText};
            }
        `
    )
);
