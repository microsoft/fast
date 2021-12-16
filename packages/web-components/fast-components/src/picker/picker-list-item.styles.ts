import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

/**
 * Styles for Picker list item
 * @public
 */
export const pickerListItemStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host {
            align-items: center;
            background: ${neutralFillStealthRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid transparent;
            box-sizing: border-box;
            display: flex;
            color: ${neutralForegroundRest};
            cursor: pointer;
            fill: currentcolor;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            height: calc(${heightNumber} * 1px);
            justify-items: center;
            line-height: ${typeRampBaseLineHeight};
            outline: none;
            overflow: hidden;
            padding: 0 calc(${designUnit} * 2.25px);
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

        :host(:${focusVisible}) {
            background: ${neutralFillStealthFocus};
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset;
            color: ${neutralForegroundFocus};
        }
}`.withBehaviors(
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

                :host(:${focusVisible}) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.HighlightText} inset;
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
