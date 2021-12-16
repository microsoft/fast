import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

/**
 * Styles for Picker menu option
 * @public
 */
export const pickerMenuOptionStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host {
            display: flex;
            align-items: center;
            justify-items: center;
            font-family: ${bodyFont};
            background: ${neutralFillStealthRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid transparent;
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${typeRampBaseFontSize};
            min-height: calc(${heightNumber} * 1px);
            line-height: ${typeRampBaseLineHeight};
            outline: none;
            overflow: hidden;
            padding: 0 calc(((${designUnit} * 3) - 3) * 1px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:hover) {
            background: ${neutralFillStealthHover};
            color: ${neutralForegroundHover};
        }

        :host(:active) {
            background: ${neutralFillStealthActive};
            color: ${neutralForegroundActive};
        }

        :host([aria-selected="true"]) {
            background: ${neutralFillRest};
            border-color: ${accentFillRest};
            color: ${neutralForegroundRest};
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    forced-color-adjust: none;
                    background: ${SystemColors.ButtonFace};
                    border-color: transparent;
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${SystemColors.Canvas};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `
        )
    );
