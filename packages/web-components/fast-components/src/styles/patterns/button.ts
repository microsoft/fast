import { css } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { heightNumber } from "../size";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
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
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeControlActive,
    strokeControlHover,
    strokeControlRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../../design-tokens";

/**
 * @internal
 */
export const baseButtonStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    interactivitySelector: string = ""
) =>
    css`
    ${display("inline-flex")} :host {
      position: relative;
      box-sizing: border-box;
      font-family: ${bodyFont};
      outline: none;
      font-size: ${typeRampBaseFontSize};
      line-height: ${typeRampBaseLineHeight};
      height: calc(${heightNumber} * 1px);
      min-width: calc(${heightNumber} * 1px);
      color: ${neutralForegroundRest};
      border-radius: calc(${controlCornerRadius} * 1px);
      fill: currentcolor;
      cursor: pointer;
    }

    :host .control {
      background: ${neutralFillRest};
      border: calc(${strokeWidth} * 1px) solid transparent;
      flex-grow: 1;
      box-sizing: border-box;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
      white-space: nowrap;
      outline: none;
      text-decoration: none;
      color: inherit;
      border-radius: inherit;
      fill: inherit;
      cursor: inherit;
      font-family: inherit;
    }

    .control,
    .end,
    .start {
      font: inherit;
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
      border-color: ${focusStrokeOuter} !important;
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset !important;
      color: ${neutralForegroundHover};
    }

    .control::-moz-focus-inner {
      border: 0;
    }

    .content {
      pointer-events: none;
    }

    .start,
    .end {
      display: flex;
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
            :host .control${interactivitySelector}:hover {
              forced-color-adjust: none;
              border-color: ${SystemColors.ButtonText};
              background: ${SystemColors.Highlight};
              color: ${SystemColors.HighlightText};
            }
            :host .control:${focusVisible} {
              forced-color-adjust: none;
              border-color: ${SystemColors.ButtonText} !important;
              box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.ButtonText} !important;
              background: ${SystemColors.ButtonFace};
              color: ${SystemColors.ButtonText};
            }
            :host([href]) .control {
              border-color: ${SystemColors.LinkText};
              background: ${SystemColors.ButtonFace};
              color: ${SystemColors.LinkText};
              fill: currentcolor;
            }
            :host([href]) .control:hover,
            :host(.neutral[href]) .control:hover,
            :host(.outline[href]) .control:hover {
              forced-color-adjust: none;
              border-color: ${SystemColors.LinkText} !important;
              box-shadow: 0 0 0 1px ${SystemColors.LinkText} !important;
              background: ${SystemColors.ButtonFace};
              color: ${SystemColors.LinkText};
            }
            :host([href]) .control:${focusVisible} {
              forced-color-adjust: none;
              border-color: ${SystemColors.LinkText} !important;
              box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.LinkText} !important;
            }
          `
        )
    );

/**
 * @internal
 */
export const AccentButtonStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    interactivitySelector: string = ""
) =>
    css`
    :host .control {
      background: ${accentFillRest};
      color: ${foregroundOnAccentRest};
    }

    :host .control${interactivitySelector}:hover {
      background: ${accentFillHover};
      color: ${foregroundOnAccentHover};
    }

    :host .control${interactivitySelector}:active {
      background: ${accentFillActive};
      color: ${foregroundOnAccentActive};
    }

    :host .control:${focusVisible} {
      box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset,
        0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${focusStrokeInner} inset !important;
      color: ${foregroundOnAccentHover};
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
              :host .control {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
              }
              :host .control${interactivitySelector}:hover,
              :host .control${interactivitySelector}:active {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.Highlight};
              }
              :host .control:${focusVisible} {
                border-color: ${SystemColors.HighlightText} !important;
                background: ${SystemColors.Highlight};
              }
              :host([href]) .control {
                background: ${SystemColors.LinkText};
                color: ${SystemColors.HighlightText};
              }
              :host([href]) .control:hover {
                background: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.LinkText};
                box-shadow: none;
                color: ${SystemColors.LinkText};
                fill: currentcolor;
              }
              :host([href]) .control:${focusVisible} {
                border-color: ${SystemColors.HighlightText} !important;
                box-shadow: 0 0 0 calc((${focusStrokeWidth} * 1px) ${SystemColors.LinkText} !important;
              }
            `
        )
    );

/**
 * @internal
 */
export const HypertextStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    interactivitySelector: string = ""
) =>
    css`
    :host {
      height: auto;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      min-width: 0;
    }

    :host .control {
      display: inline;
      padding: 0;
      background: transparent;
      border: none;
      box-shadow: none;
      line-height: 1;
      text-decoration: underline 1px;
    }
    :host .control:not([href]) {
      background-color: transparent;
    }
    :host .control${interactivitySelector} {
      background: transparent;
      color: ${neutralForegroundRest};
    }
    :host .control${interactivitySelector}:hover {
      background: transparent;
      color: ${neutralForegroundHover};
    }
    :host .control${interactivitySelector}:active {
      background: transparent;
      color: ${neutralForegroundActive};
    }
    :host .control:${focusVisible} {
      box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} !important;
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
        :host .control:${focusVisible} {
          color: ${SystemColors.LinkText};
        }
      `
        )
    );

/**
 * @internal
 */
export const LightweightButtonStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    interactivitySelector: string = ""
) =>
    css`
    :host .control {
      padding: 0;
      height: initial;
      background: transparent !important;
    }

    :host .content {
      position: relative;
    }

    :host .control:${focusVisible} {
      border-color: transparent !important;
      box-shadow: none !important;
    }

    :host .content::before {
      content: "";
      display: block;
      height: calc(${strokeWidth} * 1px);
      position: absolute;
      top: calc(1em + 3px);
      width: 100%;
      background: transparent;
    }

    :host .control${interactivitySelector}:hover .content::before,
    :host .control${interactivitySelector}:active .content::before {
      background: ${neutralForegroundHover};
    }

    :host .control${interactivitySelector}:${focusVisible} .content::before {
      background: ${neutralForegroundHover};
      height: calc(${strokeWidth} * 2px);
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
              :host .control {
                border-color: ${SystemColors.ButtonFace} !important;
                color: ${SystemColors.ButtonText};
              }
              :host .control${interactivitySelector}:hover,
              :host .control${interactivitySelector}:active,
              :host .control:${focusVisible} {
                background: ${SystemColors.ButtonFace};
                color: ${SystemColors.Highlight};
              }
              :host .control${interactivitySelector}:hover .content::before,
              :host .control${interactivitySelector}:active .content::before,
              :host .control:not([disabled]):focus-visible .content::before  {
                background: ${SystemColors.Highlight};
              }
              :host([href]) .control:hover,
              :host([href]) .control:${focusVisible} {
                border-color: ${SystemColors.ButtonFace} !important;
                box-shadow: none !important;
                background: ${SystemColors.ButtonFace};
                color: ${SystemColors.LinkText};
              }
              :host([href]) .control:hover .content::before,
              :host([href]) .control:${focusVisible} .content::before {
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
            background: transparent !important;
            border-color: ${strokeControlRest};
        }

        :host .control${interactivitySelector}:active {
            border-color: ${strokeControlHover};
        }

        :host .control${interactivitySelector}:active {
            border-color: ${strokeControlActive};
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
export const StealthButtonStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition,
    interactivitySelector: string = ""
) =>
    css`
    :host .control {
      background: ${neutralFillStealthRest};
    }

    :host .control${interactivitySelector}:hover,
    :host .control${interactivitySelector}:${focusVisible} {
      background: ${neutralFillStealthHover};
    }

    :host .control${interactivitySelector}:active {
      background: ${neutralFillStealthActive};
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
        :host .control {
          background: ${SystemColors.ButtonFace};
          border-color: ${SystemColors.ButtonFace};
          color: ${SystemColors.ButtonText};
          fill: currentcolor;
        }

        :host .control${interactivitySelector}:hover,
        :host .control${interactivitySelector}:active,
        :host .control${interactivitySelector}:${focusVisible}{
          border-color: ${SystemColors.Highlight} !important;
          box-shadow: none !important;
          background: ${SystemColors.Highlight};
          color: ${SystemColors.HighlightText};
          fill: currentcolor;
        }

        :host([href]) .control {
          border-color: ${SystemColors.ButtonFace};
          color: ${SystemColors.LinkText};
        }

        :host([href])  .control${interactivitySelector}:hover,
        :host([href])  .control${interactivitySelector}:active,
        :host([href])  .control${interactivitySelector}:${focusVisible} {
          background: ${SystemColors.LinkText};
          border-color: ${SystemColors.LinkText} !important;
          color: ${SystemColors.HighlightText};
          fill: currentcolor;
        }
      `
        )
    );
