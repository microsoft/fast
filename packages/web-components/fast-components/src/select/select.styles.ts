import type { ElementStyles } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element";
import type {
    FoundationElementTemplate,
    SelectOptions,
} from "@microsoft/fast-foundation";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    ListboxOption,
    Select,
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
    foregroundOnAccentFocus,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillStealthRest,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { listboxStyles } from "../listbox/listbox.styles.js";
import { elevation } from "../styles/elevation.js";
import { heightNumber } from "../styles/size.js";

/**
 * Styles for Select.
 *
 * @public
 */
export const selectStyles: FoundationElementTemplate<ElementStyles, SelectOptions> = (
    context,
    definition
) => {
    const selectContext = context.name === context.tagFor(Select);

    // The expression interpolations present in this block cause Prettier to generate
    // various formatting bugs.
    // prettier-ignore
    return css`
        ${display("inline-flex")}

        :host {
            --elevation: 14;
            background: ${neutralFillInputRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid ${accentFillRest};
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            font-family: ${bodyFont};
            height: calc(${heightNumber} * 1px);
            position: relative;
            user-select: none;
            min-width: 250px;
            outline: none;
            vertical-align: top;
        }

        ${selectContext ? css`
            :host(:not([aria-haspopup])) {
                --elevation: 0;
                border: 0;
                height: auto;
                min-width: 0;
            }
        ` : ""}

        ${listboxStyles(context, definition)}

        :host .listbox {
            ${elevation}
            border: none;
            display: flex;
            left: 0;
            position: absolute;
            width: 100%;
            z-index: 1;
        }

        .control + .listbox {
            --stroke-size: calc(${designUnit} * ${strokeWidth} * 2);
            max-height: calc(
                (var(--listbox-max-height) * ${heightNumber} + var(--stroke-size)) * 1px
            );
        }

        ${selectContext ? css`
            :host(:not([aria-haspopup])) .listbox {
                left: auto;
                position: static;
                z-index: auto;
            }
        ` : ""}

        .listbox[hidden] {
            display: none;
        }

        .control {
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            font-size: ${typeRampBaseFontSize};
            font-family: inherit;
            line-height: ${typeRampBaseLineHeight};
            min-height: 100%;
            padding: 0 calc(${designUnit} * 2.25px);
            width: 100%;
        }

        :host(:not([disabled]):hover) {
            background: ${neutralFillInputHover};
            border-color: ${accentFillHover};
        }

        :host(:${focusVisible}) {
            border-color: ${focusStrokeOuter};
        }

        :host(:not([size]):not([multiple]):not([open]):${focusVisible}),
        :host([multiple]:${focusVisible}),
        :host([size]:${focusVisible}) {
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter};
        }

        :host(:not([multiple]):not([size]):${focusVisible}) ::slotted(${context.tagFor(
            ListboxOption
        )}[aria-selected="true"]:not([disabled])) {
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${focusStrokeInner};
            border-color: ${focusStrokeOuter};
            background: ${accentFillFocus};
            color: ${foregroundOnAccentFocus};
        }

        :host([disabled]) {
            cursor: ${disabledCursor};
            opacity: ${disabledOpacity};
        }

        :host([disabled]) .control {
            cursor: ${disabledCursor};
            user-select: none;
        }

        :host([disabled]:hover) {
            background: ${neutralFillStealthRest};
            color: ${neutralForegroundRest};
            fill: currentcolor;
        }

        :host(:not([disabled])) .control:active {
            background: ${neutralFillInputActive};
            border-color: ${accentFillActive};
            border-radius: calc(${controlCornerRadius} * 1px);
        }

        :host([open][position="above"]) .listbox {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 0;
            bottom: calc(${heightNumber} * 1px);
        }

        :host([open][position="below"]) .listbox {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 0;
            top: calc(${heightNumber} * 1px);
        }

        .selected-value {
            flex: 1 1 auto;
            font-family: inherit;
            min-width: calc(var(--listbox-scroll-width, 0) - (${designUnit} * 4) * 1px);
            overflow: hidden;
            text-align: start;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .indicator {
            flex: 0 0 auto;
            margin-inline-start: 1em;
        }

        slot[name="listbox"] {
            display: none;
            width: 100%;
        }

        :host([open]) slot[name="listbox"] {
            display: flex;
            position: absolute;
            ${elevation}
        }

        .end {
            margin-inline-start: auto;
        }

        .start,
        .end,
        .indicator,
        .select-indicator,
        ::slotted(svg) {
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            fill: currentcolor;
            height: 1em;
            min-height: calc(${designUnit} * 4px);
            min-width: calc(${designUnit} * 4px);
            width: 1em;
        }

        ::slotted([role="option"]),
        ::slotted(option) {
            flex: 0 0 auto;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    border-color: ${SystemColors.Highlight};
                }

                :host(:not([disabled]):${focusVisible}) {
                    background-color: ${SystemColors.ButtonFace};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.Highlight};
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([disabled]):${focusVisible}) .listbox {
                    background: ${SystemColors.ButtonFace};
                }

                :host([disabled]) {
                    border-color: ${SystemColors.GrayText};
                    background-color: ${SystemColors.ButtonFace};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                    forced-color-adjust: none;
                }

                :host([disabled]:hover) {
                    background: ${SystemColors.ButtonFace};
                }

                :host([disabled]) .control {
                    color: ${SystemColors.GrayText};
                    border-color: ${SystemColors.GrayText};
                }

                :host([disabled]) .control .select-indicator {
                    fill: ${SystemColors.GrayText};
                }

                :host(:${focusVisible}) ::slotted([aria-selected="true"][role="option"]),
                :host(:${focusVisible}) ::slotted(option[aria-selected="true"]),
                :host(:${focusVisible}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }

                .start,
                .end,
                .indicator,
                .select-indicator,
                ::slotted(svg) {
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }
            `
            )
        );
};
