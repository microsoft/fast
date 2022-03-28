import { css } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    OverrideFoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../size.js";
import {
    accentFillActive,
    accentFillFocus,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundFocus,
    accentForegroundHover,
    accentForegroundRest,
    bodyFont,
    density,
    designUnit,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentActive,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    strokeControlStrongActive,
    strokeControlStrongHover,
    strokeControlStrongRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../../design-tokens.js";
import { styleModuleBehavior } from "../../style-module/index.js";

/**
 * @internal
 */
export const BaseButtonStyles = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<any>,
    interactivitySelector: string = "",
    nonInteractivitySelector: string = ""
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
            fill: currentcolor;
            cursor: pointer;
        }
        :host .control {
            border: calc(${strokeWidth} * 1px) solid transparent;
            flex-grow: 1;
            box-sizing: border-box;
            display: inline-flex;
            justify-content: center;
            align-items: baseline;
            padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
            white-space: nowrap;
            outline: none;
            text-decoration: none;
            border-radius: inherit;
            fill: inherit;
            cursor: inherit;
            font-weight: inherit;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
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
        :host .control:${focusVisible} {
            border-color: ${focusStrokeOuter} ;
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset ;
        }
        .control::-moz-focus-inner {
            border: 0;
        }
        .content {
            pointer-events: none;
        }
        .start,
        .content,
        .end {
            align-self: center;
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
        styleModuleBehavior(
            context.type,
            interactivitySelector,
            nonInteractivitySelector
        ),
        forcedColorsStylesheetBehavior(
            css`
              :host .control {
                  color: ${SystemColors.ButtonText};
                  fill: currentcolor;
              }
              :host .control${interactivitySelector}:hover,
              :host .control${interactivitySelector}:active {
                  forced-color-adjust: none;
                  border-color: ${SystemColors.ButtonText};
                  background: ${SystemColors.Highlight};
                  color: ${SystemColors.HighlightText};
              }
              :host .control:${focusVisible} {
                  forced-color-adjust: none;
                  border-color: ${SystemColors.ButtonText} ;
                  box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.ButtonText} ;
                  background: ${SystemColors.ButtonFace};
                  color: ${SystemColors.ButtonText};
              }
          `
        )
    );

/**
 * @internal
 */
export const AccentButtonStyles = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<any>,
    interactivitySelector: string = "",
    nonInteractivitySelector: string = ""
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
            background: ${accentFillFocus};
            box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset,
              0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${focusStrokeInner} inset ;
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
                    background: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.ButtonText} inset,
                      0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${SystemColors.HighlightText} inset ;
                    color: ${SystemColors.HighlightText};
                }
            `
        )
    );

/**
 * @internal
 */
export const HypertextStyles = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<any>,
    interactivitySelector: string = "",
    nonInteractivitySelector: string = ""
) =>
    css`
        :host {
            height: auto;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            min-width: 0;
        }
        :host(:not([href])) .control {
            background: transparent;
        }
        :host .control {
            display: inline-flex;
            align-items: baseline;
            padding: 0;
            background: transparent;
            border: none;
            box-shadow: none;
            line-height: 1;
            text-decoration: underline 1px;
        }
        :host .control${interactivitySelector},
        :host .control${interactivitySelector}:hover {
            background: transparent;
        }
        :host .control${interactivitySelector}:active {
            background: transparent;
            text-decoration: none;
        }
        :host .control:${focusVisible} {
            box-shadow: none;
            text-decoration: underline 3px;
        }
    `;

/**
 * @internal
 */
export const LightweightButtonStyles = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<any>,
    interactivitySelector: string = "",
    nonInteractivitySelector: string = ""
) =>
    css`
        :host .control {
            background: ${neutralFillStealthRest};
            color: ${accentForegroundRest};
        }
        :host .control${interactivitySelector}:hover {
            background: ${neutralFillStealthHover};
            color: ${accentForegroundHover};
        }
        :host .control${interactivitySelector}:active {
            background: ${neutralFillStealthActive};
            color: ${accentForegroundActive};
        }
        :host .control:${focusVisible} {
            background: ${neutralFillStealthFocus};
            color: ${accentForegroundFocus};
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host .control {
                    border-color: ${SystemColors.ButtonFace};
                    color: ${SystemColors.ButtonText};
                }
                :host .control${interactivitySelector}:hover,
                :host .control${interactivitySelector}:active,
                :host .control:${focusVisible} {
                    background: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.ButtonFace};
                    color: ${SystemColors.Highlight};
                    box-shadow: none;
                }
            `
        )
    );

/**
 * @internal
 */
export const OutlineButtonStyles = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<any>,
    interactivitySelector: string = "",
    nonInteractivitySelector: string = ""
) =>
    css`
        :host .control {
            background: transparent;
            border-color: ${strokeControlStrongRest};
        }
        :host .control${interactivitySelector}:hover {
            background: transparent;
            border-color: ${strokeControlStrongHover};
        }
        :host .control${interactivitySelector}:active {
            background: transparent;
            border-color: ${strokeControlStrongActive};
        }
        :host .control:${focusVisible} {
            background: transparent;
            border-color: ${focusStrokeOuter};
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
                    border-color: ${SystemColors.Highlight} ;
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.Highlight} ;
                    color: ${SystemColors.Highlight};
                }
            `
        )
    );

/**
 * @internal
 */
export const StealthButtonStyles = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<any>,
    interactivitySelector: string = "",
    nonInteractivitySelector: string = ""
) =>
    css`
        :host .control {
            background: ${neutralFillStealthRest};
        }
        :host .control${interactivitySelector}:hover {
            background: ${neutralFillStealthHover};
        }
        :host .control${interactivitySelector}:active {
            background: ${neutralFillStealthActive};
        }
        :host .control:${focusVisible} {
            background: ${neutralFillStealthFocus};
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
                :host .control${interactivitySelector}:${focusVisible} {
                    border-color: ${SystemColors.Highlight} ;
                    box-shadow: none ;
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }
            `
        )
    );
