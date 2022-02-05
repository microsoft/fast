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
    accentFillActive,
    accentFillFocus,
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
    foregroundOnAccentFocus,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    neutralFillHover,
    neutralForegroundRest,
    neutralLayer3,
    neutralLayerFloating,
    neutralStrokeRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/size";

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
        border: calc(${focusStrokeWidth} * 1px) solid ${neutralLayerFloating};
        box-sizing: border-box;
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

    :host(:${focusVisible}) {
        box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${focusStrokeInner};
        border-color: ${focusStrokeOuter};
        background: ${accentFillFocus};
        color: ${foregroundOnAccentFocus};
    }

    :host([aria-selected="true"]) {
        background: ${accentFillRest};
        color: ${foregroundOnAccentRest};
    }

    :host(:hover) {
        background: ${accentFillHover};
        color: ${foregroundOnAccentHover};
    }

    :host(:active) {
        background: ${accentFillActive};
        color: ${foregroundOnAccentActive};
    }

    :host(:not([aria-selected="true"]):hover),
    :host(:not([aria-selected="true"]):active) {
        background: ${neutralFillHover};
        color: ${neutralForegroundRest};
    }

    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: ${disabledOpacity};
    }

    :host([disabled]:hover) {
        background-color: inherit;
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
