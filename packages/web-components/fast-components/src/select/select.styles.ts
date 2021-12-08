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
import { appearanceBehavior } from "../utilities/behaviors.js";
import {
    accentFillFocus,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentFocus,
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
    neutralStrokeInputFilledActive,
    neutralStrokeInputFilledFocus,
    neutralStrokeInputFilledHover,
    neutralStrokeInputFilledRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { elevationShadowFlyout } from "../styles/elevation.js";
import { listboxStyles } from "../listbox/listbox.styles.js";
import { heightNumber } from "../styles/size.js";

export const selectFilledStyles: FoundationElementTemplate<
    ElementStyles,
    SelectOptions
> = (context, definition) =>
    css`
        :host {
            background: ${neutralFillRest};
            border-color: transparent;
        }

        :host(:not([disabled]):hover) {
            background: ${neutralFillHover};
            border-color: transparent;
        }

        :host(:not([disabled]):active) {
            background: ${neutralFillActive};
            border-color: transparent;
        }
    `;

export const selectStealthStyles: FoundationElementTemplate<
    ElementStyles,
    SelectOptions
> = (context, definition) =>
    css`
        :host {
            background: ${neutralFillStealthRest};
            border-color: transparent;
        }

        :host(:not([disabled]):hover) {
            background: ${neutralFillStealthHover};
            border-color: transparent;
        }

        :host(:not([disabled]):active) {
            background: ${neutralFillStealthActive};
            border-color: transparent;
        }
    `;

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
        background: ${neutralFillRest};
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeInputFilledRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        box-sizing: border-box;
        color: ${neutralForegroundRest};
        fill: currentcolor;
        font-family: ${bodyFont};
        height: calc(${heightNumber} * 1px);
        position: relative;
        user-select: none;
        min-width: 250px;
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

    .listbox {
        box-shadow: ${elevationShadowFlyout};
        border: none;
        display: flex;
        left: 0;
        position: absolute;
        width: 100%;
        z-index: 1;
        margin: 1px 0;
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
        padding: 0 calc(${designUnit} * 3px);
        width: 100%;
    }

    :host(:not([disabled]):hover) {
        background: ${neutralFillHover};
        border-color: ${neutralStrokeInputFilledHover};
        color: ${neutralForegroundHover};
    }

    :host(:not([disabled]):active)  {
        background: ${neutralFillActive};
        border-color: ${neutralStrokeInputFilledActive};
        color: ${neutralForegroundActive};
    }

    :host(:${focusVisible}) {
        outline: none;
        background: ${neutralFillFocus};
        border-color: ${neutralStrokeInputFilledFocus};
        box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset;
        color: ${neutralForegroundFocus};
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

    :host([open]) .control {
        color: ${neutralForegroundActive};
    }

    :host([open][position="above"]) .listbox {
        bottom: calc((${heightNumber} + ${designUnit}) * 1px);
    }

    :host([open][position="below"]) .listbox {
        top: calc((${heightNumber} + ${designUnit}) * 1px);
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
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }

    .start,
    .end,
    .indicator,
    ::slotted(svg) {
        display: flex;
    }

    ::slotted([role="option"]) {
        flex: 0 0 auto;
    }
    `.withBehaviors(
        appearanceBehavior("filled", selectFilledStyles(context, definition)),
        appearanceBehavior("stealth", selectStealthStyles(context, definition)),
        forcedColorsStylesheetBehavior(
            css`
                :host([disabled]) {
                    border-color: ${SystemColors.GrayText};
                    color: ${SystemColors.GrayText};
                    opacity: 1;
                }

                :host(:not([disabled]):hover),
                :host(:not([disabled]):active) {
                    background: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.Highlight};
                }

                :host(:${focusVisible}) {
                    forced-color-adjust: none;
                    background: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.Highlight};
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }

                :host([open]) .listbox {
                    background: ${SystemColors.ButtonFace};
                    border: 1px solid ${SystemColors.ButtonText};
                }

                :host(:${focusVisible}) ::slotted([role="option"][aria-selected="true"]:not([disabled])) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                    color: ${SystemColors.HighlightText};
                }

                ::slotted([role="option"]:not([aria-selected="true"]):not([disabled]):hover) {
                    color: ${SystemColors.ButtonText};
                    background: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.Highlight};
                    box-shadow: none;
                }
            `
        )
    );
};
