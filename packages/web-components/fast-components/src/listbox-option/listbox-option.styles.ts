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
    accentFillFocus,
    accentFillHover,
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    disabledOpacity,
    focusStrokeOuter,
    foregroundOnAccentFocus,
    foregroundOnAccentHover,
    neutralFillHover,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralLayer3,
    neutralLayerFloating,
    neutralStrokeRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { heightNumber } from "../styles/size.js";

/**
 * Styles for the {@link @microsoft/fast-components#fastOption | Listbox Option} component.
 *
 * @param context - the element definition context
 * @param definition - the foundation element definition
 * @returns The element styles for the listbox option component
 *
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
            border: calc(${strokeWidth} * 1px) solid ${neutralLayerFloating};
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
            padding: 0 1ch;
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

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${neutralStrokeRest};
            background: ${neutralLayer3};
            color: ${neutralForegroundRest};
        }

        :host([aria-checked="true"][aria-selected="false"]:not([disabled]):hover) {
            background: ${neutralFillHover};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${focusStrokeOuter};
            background: ${accentFillFocus};
            color: ${foregroundOnAccentFocus};
        }

        :host([aria-checked="true"][aria-selected="true"]:hover) {
            background: ${accentFillHover};
            color: ${foregroundOnAccentHover};
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
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${SystemColors.Canvas};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${SystemColors.ButtonFace};
                    color: ${SystemColors.ButtonText};
                    border-color: ${SystemColors.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                    border-color: ${SystemColors.ButtonText};
                }
            `
        )
    );
