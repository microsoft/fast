import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    density,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { styleModuleBehavior } from "../style-module/index.js";
import { heightNumber } from "../styles/size.js";

/**
 * Styles for Tab
 * @public
 */
export const tabStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        ${display("inline-flex")} :host {
            box-sizing: border-box;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            font-weight: 400;
            line-height: ${typeRampBaseLineHeight};
            height: calc(${heightNumber} * 1px);
            padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
            background: ${neutralFillStealthRest};
            color: ${neutralForegroundRest};
            fill: currentcolor;
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid transparent;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            outline: none;
        }

        :host(:not(.disabled):hover),
        :host(.vertical:not(.disabled):hover) {
            background: ${neutralFillStealthHover};
            color: ${neutralForegroundHover};
        }

        :host(:not(.disabled):active),
        :host(.vertical:not(.disabled):active) {
            background: ${neutralFillStealthActive};
            color: ${neutralForegroundActive};
        }

        :host([aria-selected="true"]),
        :host(.vertical[aria-selected="true"]) {
            z-index: 2;
            background: ${neutralFillRest};
            border-color: ${accentFillRest};
            color: ${neutralForegroundRest};
        }

        :host([aria-selected="true"]:hover),
        :host(.vertical[aria-selected="true"]:hover) {
            background: ${neutralFillHover};
            border-color: ${accentFillHover};
            color: ${neutralForegroundHover};
        }

        :host([aria-selected="true"]:active),
        :host(.vertical[aria-selected="true"]:active) {
            background: ${neutralFillActive};
            border-color: ${accentFillActive};
            color: ${neutralForegroundActive};
        }

        :host([aria-selected="true"]:${focusVisible}),
        :host(.vertical[aria-selected="true"]:${focusVisible}) {
            background: ${neutralFillFocus};
            border-color: ${focusStrokeOuter} ;
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset ;
            color: ${neutralForegroundFocus};
        }

        :host([disabled]) {
            cursor: ${disabledCursor};
            opacity: ${disabledOpacity};
        }

        :host([disabled]:hover) {
            background: transparent;
        }

        :host(.vertical) {
            justify-content: start;
            grid-column: 2 / 3;
        }
    `.withBehaviors(
        styleModuleBehavior(context.type),
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.ButtonFace};
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([disabled]):hover),
                :host(.vertical:not([disabled]):hover),
                :host(:not([disabled]):active),
                :host(.vertical:not([disabled]):active),
                :host([aria-selected="true"]),
                :host(.vertical[aria-selected="true"]),
                :host([aria-selected="true"]:hover),
                :host(.vertical[aria-selected="true"]:hover),
                :host([aria-selected="true"]:active),
                :host(.vertical[aria-selected="true"]:active) {
                    forced-color-adjust: none;
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }

                :host([aria-selected="true"]:${focusVisible}),
                :host(.vertical[aria-selected="true"]:${focusVisible}) {
                    forced-color-adjust: none;
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.ButtonText} inset,
                      0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${SystemColors.HighlightText} inset;
                    color: ${SystemColors.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:hover) {
                    opacity: 1;
                    border-color: currentcolor;
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                }
            `
        )
    );
