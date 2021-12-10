import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {} from "..";
import {
    bodyFont,
    controlCornerRadius,
    designUnit,
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
            color: ${neutralForegroundFocus};
        }
}`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
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
