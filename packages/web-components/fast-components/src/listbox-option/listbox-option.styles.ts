import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import type {
    FoundationElementTemplate,
    ListboxOptionOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
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
import { heightNumber } from "../styles/size";

/**
 * Styles for Option
 * @public
 */
export const optionStyles: FoundationElementTemplate<
    ElementStyles,
    ListboxOptionOptions
> = (context, definition) =>
    css`
        ${display("inline-flex")} :host {
            position: relative;
            font-family: ${bodyFont};
            background: ${neutralFillStealthRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid transparent;
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${typeRampBaseFontSize};
            height: calc(${heightNumber} * 1px);
            line-height: ${typeRampBaseLineHeight};
            outline: none;
            overflow: hidden;
            align-items: center;
            padding: 0 calc(((${designUnit} * 3) - 3) * 1px );
            user-select: none;
            white-space: nowrap;
        }
        :host(:not([disabled]):hover),
        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: ${neutralFillStealthHover};
            color: ${neutralForegroundHover};
        }
        :host(:not([disabled]):active),
        :host(:not([disabled]):not([aria-selected='true']):active),
        :host([aria-selected="true"]),
        :host(:not([disabled])[aria-selected="true"]:hover),
        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${neutralFillStealthActive};
            border-color: ${accentFillRest};
            color: ${neutralForegroundActive};
        }
        :host(:${focusVisible}) {
            border-color: ${focusStrokeOuter};
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
                :host([aria-selected="true"])::before,
                :host(:not([disabled]):active)::before {
                    background: ${SystemColors.HighlightText};
                }
            `
        )
    );
