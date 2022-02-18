import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/size";
import {
    accentForegroundRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const optionStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        ${display("inline-flex")} :host {
            position: relative;
            font-family: ${bodyFont};
            background: ${neutralFillStealthRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${focusStrokeWidth} * 1px) solid transparent;
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            cursor: pointer;
            fill: currentcolor;
            font-size: ${typeRampBaseFontSize};
            height: calc(${heightNumber} * 1px);
            line-height: ${typeRampBaseLineHeight};
            margin: 0 calc(${designUnit} * 1px);
            outline: none;
            overflow: hidden;
            align-items: center;
            padding: 0 calc(${designUnit} * 2.25px);
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):hover) {
            background: ${neutralFillStealthHover};
            color: ${neutralForegroundHover};
        }

        :host([aria-selected="true"]),
        :host(:not([disabled]):active),
        :host(:not([disabled])[aria-selected="true"]:hover),
        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${neutralFillStealthActive};
            color: ${neutralForegroundActive};
        }

        :host([disabled]) {
            cursor: ${disabledCursor};
            opacity: ${disabledOpacity};
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end,
        ::slotted(svg) {
            display: flex;
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.ButtonFace};
                    border-color: transparent;
                    color: ${SystemColors.ButtonText};
                    forced-color-adjust: none;
                }
                :host(:not([disabled])[aria-selected="true"]:hover),
                :host(:not([disabled])[aria-selected="true"]:active),
                :host(:not([disabled]):not([aria-selected="true"]):hover),
                :host(:not([disabled]):not([aria-selected="true"]):active),
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
