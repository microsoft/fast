import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../size";
import {
    accentFillActive,
    accentFillFocus,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    bodyFont,
    controlCornerRadius,
    density,
    designUnit,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentActive,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
<<<<<<< HEAD
=======
    strokeControlStrongActive,
    strokeControlStrongHover,
    strokeControlStrongRest,
>>>>>>> f6eb1c00c (adjust deltas, add fill stroke token, and update stroke on small inputs)
    strokeWidth,
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
        background-color: ${neutralFillRest};
        color: ${neutralForegroundRest};
        border-radius: calc(${controlCornerRadius} * 1px);
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
        border: calc(${strokeWidth} * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: ${neutralFillHover};
    }

    :host(:active) {
        background-color: ${neutralFillActive};
    }

    .control:${focusVisible} {
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset;
    }

    .control.icon-only {
      padding: 0;
      line-height: 0;
    }

    :host .control${interactivitySelector}:hover {
      background: ${neutralFillHover};
      color: ${neutralForegroundHover};
    }

    :host .control${interactivitySelector}:active {
      background: ${neutralFillActive};
      color: ${neutralForegroundActive};
    }

    :host .control:${focusVisible} {
      background: ${neutralFillFocus};
      border-color: ${focusStrokeOuter} !important;
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset !important;
      color: ${neutralForegroundHover};
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
              box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.ButtonText} inset;
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
        color: ${foregroundOnAccentRest};
    }

    :host([appearance="accent"]:hover) {
        background: ${accentFillHover};
        color: ${foregroundOnAccentHover};
    }

    :host([appearance="accent"]:active) .control:active {
        background: ${accentFillActive};
        color: ${foregroundOnAccentActive};
    }

    :host .control:${focusVisible} {
      background: ${accentFillFocus};
      box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset,
        0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${focusStrokeInner} inset !important;
      color: ${foregroundOnAccentHover};
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host([appearance="accent"]) .control {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host([appearance="accent"]) .control:hover,
            :host([appearance="accent"]:active) .control:active {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.Highlight};
            }

            :host([appearance="accent"]) .control:${focusVisible} {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.HighlightText} inset;
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
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.HighlightText} inset;
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
        color: ${accentForegroundRest};
        border-bottom: calc(${strokeWidth} * 1px) solid ${accentForegroundRest};
    }

    :host([appearance="hypertext"]:hover),
    :host([appearance="hypertext"]) .control:hover {
        background: transparent;
        border-bottom-color: ${accentForegroundHover};
    }

    :host([appearance="hypertext"]:active),
    :host([appearance="hypertext"]) .control:active {
        background: transparent;
        border-bottom-color: ${accentForegroundActive};
    }

    :host([appearance="hypertext"]) .control:${focusVisible} {
        border-bottom: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
        margin-bottom: calc(calc(${strokeWidth} - ${focusStrokeWidth}) * 1px);
    }
`.withBehaviors(
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
        color: ${accentForegroundRest};
    }

    :host([appearance="lightweight"]) .control {
        padding: 0;
        height: initial;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host([appearance="lightweight"]:hover) {
        background: transparent;
        color: ${accentForegroundHover};
    }

    :host([appearance="lightweight"]:active) {
        background: transparent;
        color: ${accentForegroundActive};
    }

    :host([appearance="lightweight"]) .content {
        position: relative;
    }

    :host([appearance="lightweight"]) .content::before {
        content: "";
        display: block;
        height: calc(${strokeWidth} * 1px);
        position: absolute;
        top: calc(1em + 4px);
        width: 100%;
    }

    :host([appearance="lightweight"]:hover) .content::before {
        background: ${accentForegroundHover};
    }

    :host([appearance="lightweight"]:active) .content::before {
        background: ${accentForegroundActive};
    }

    :host([appearance="lightweight"]) .control:${focusVisible} .content::before {
        background: ${neutralForegroundRest};
        height: calc(${focusStrokeWidth} * 1px);
    }
`.withBehaviors(
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
export const OutlineButtonStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    interactivitySelector: string = ""
) =>
    css`
        :host .control {
            background: transparent;
            border-color: ${strokeControlStrongRest} !important;
        }

        :host .control${interactivitySelector}:hover {
            background: transparent;
            border-color: ${strokeControlStrongHover} !important;
        }

        :host .control${interactivitySelector}:active {
            background: ${neutralFillActive};
            border-color: ${strokeControlStrongActive} !important;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host .control {
                    border-color: ${SystemColors.ButtonText};
                }
                :host .control${interactivitySelector}:hover {
                  border-color: ${SystemColors.Highlight};
                  color: ${SystemColors.Highlight};
                }
                :host .control${interactivitySelector}:${focusVisible} {
                  forced-color-adjust: none;
                  border-color: ${SystemColors.Highlight} !important;
                  box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.Highlight} !important;
                  color: ${SystemColors.Highlight};
                }
                :host([href]) {
                    border-color: ${SystemColors.LinkText};
                }
                :host([href]) .control${interactivitySelector}:${focusVisible} {
                  forced-color-adjust: none;
                  border-color: ${SystemColors.LinkText} !important;
                  box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.LinkText} !important;
                  color: ${SystemColors.LinkText};
                }
            `
        )
    );

/**
 * @internal
 */
export const StealthButtonStyles = css`
    :host([appearance="stealth"]) {
        background: ${neutralFillStealthRest};
    }

    :host([appearance="stealth"]:hover) {
        background: ${neutralFillStealthHover};
    }

    :host([appearance="stealth"]:active) {
        background: ${neutralFillStealthActive};
    }
`.withBehaviors(
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
