import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import type {
    FoundationElementTemplate,
    ListboxOptionOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentActive,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
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
            align-items: center;
            font-family: ${bodyFont};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${focusStrokeWidth} * 1px) solid transparent;
            box-sizing: border-box;
            background: ${neutralFillStealthRest};
            color: ${neutralForegroundRest};
            cursor: pointer;
            flex: 0 0 auto;
            fill: currentcolor;
            font-size: ${typeRampBaseFontSize};
            height: calc(${heightNumber} * 1px);
            line-height: ${typeRampBaseLineHeight};
            margin: 0 calc((${designUnit} - ${focusStrokeWidth}) * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 1ch;
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: ${neutralFillStealthHover};
        }

        :host(:not([disabled]):not([aria-selected="true"]):active) {
            background: ${neutralFillStealthActive};
        }

        :host([aria-selected="true"]) {
            background: ${accentFillRest};
            color: ${foregroundOnAccentRest};
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: ${accentFillHover};
            color: ${foregroundOnAccentHover};
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: ${accentFillActive};
            color: ${foregroundOnAccentActive};
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

        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            height: calc(${designUnit} * 4px);
            width: calc(${designUnit} * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: ${focusStrokeOuter};
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 2 * 1px) inset
                ${focusStrokeInner};
        }
    `.withBehaviors(
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
