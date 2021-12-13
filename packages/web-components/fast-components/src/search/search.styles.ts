import { css, ElementStyles } from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
    TextFieldOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { Swatch } from "../color/swatch";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    density,
    designUnit,
    disabledOpacity,
    fillColor,
    focusStrokeOuter,
    neutralFillHover,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillRecipe,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRecipe,
    neutralForegroundRest,
    neutralStrokeRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { DirectionalStyleSheetBehavior, heightNumber } from "../styles/index";

/**
 * LTR styles for search
 * @internal
 */
const ltrStyles = css`
    .clear-button {
        right: 1px;
    }
`;

/**
 * RTL styles for search
 * @internal
 */
const rtlStyles = css`
    .clear-button {
        left: 1px;
    }
`;

const closeButtonHover = DesignToken.create<Swatch>("close-button-hover").withDefault(
    (target: HTMLElement) => {
        const buttonRecipe = neutralFillStealthRecipe.getValueFor(target);
        const inputRecipe = neutralFillRecipe.getValueFor(target);
        return buttonRecipe.evaluate(target, inputRecipe.evaluate(target).hover).hover;
    }
);

const closeButtonActive = DesignToken.create<Swatch>("close-button-active").withDefault(
    (target: HTMLElement) => {
        const buttonRecipe = neutralFillStealthRecipe.getValueFor(target);
        const inputRecipe = neutralFillRecipe.getValueFor(target);
        return buttonRecipe.evaluate(target, inputRecipe.evaluate(target).hover).active;
    }
);

export const searchStyles: FoundationElementTemplate<ElementStyles, TextFieldOptions> = (
    context,
    definition
) =>
    css`
    ${display("inline-block")} :host {
        font-family: ${bodyFont};
        outline: none;
        user-select: none;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${neutralForegroundRest};
        background: ${neutralFillInputRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${accentFillRest};
        height: calc(${heightNumber} * 1px);
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0;
        padding-inline-start: calc(${designUnit} * 2px + 1px);
        padding-inline-end: calc((${designUnit} * 2px) + (${heightNumber} * 1px) + 1px);
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
    }

    .control::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    .control:hover,
    .control:${focusVisible},
    .control:disabled,
    .control:active {
        outline: none;
    }

    .clear-button {
        position: absolute;
        top: 1px;
        height: calc(100% - 2px);
        opacity: 0;
        background: transparent;
        color: ${neutralForegroundRest};
        fill: currentcolor;
        border: none;
        border-radius: calc(${controlCornerRadius} * 1px);
        min-width: calc(${heightNumber} * 1px);
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        outline: none;
        font-family: ${bodyFont};
        padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
    }

    .clear-button:hover {
        background: ${neutralFillStealthHover};
    }

    .clear-button:active {
        background: ${neutralFillStealthActive};
    }

    :host([appearance="filled"]) .clear-button:hover {
        background: ${closeButtonHover};
    }

    :host([appearance="filled"]) .clear-button:active {
        background: ${closeButtonActive};
    }

    .input-wrapper {
        display: flex;
        position: relative;
        width: 100%;
    }

    .label {
        display: block;
        color: ${neutralForegroundRest};
        cursor: pointer;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .input-wrapper,
    .start,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: 1px;
        fill: currentcolor;
    }

    ::slotted([slot="end"]) {
        height: 100%
    }

    .end {
        margin-inline-end: 1px;
    }

    ::slotted(svg) {
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        margin-inline-end: 11px;
        margin-inline-start: 11px;
        margin-top: auto;
        margin-bottom: auto;
    }

    :host(:hover:not([disabled])) .root {
        background: ${neutralFillInputHover};
        border-color: ${accentFillHover};
    }

    :host(:active:not([disabled])) .root {
        background: ${neutralFillInputHover};
        border-color: ${accentFillActive};
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 1px ${focusStrokeOuter} inset;
    }

    .clear-button__hidden {
        opacity: 0;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button,
    :host(:active:not([disabled], [readOnly])) .clear-button,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button {
        opacity: 1;
    }

    :host(:hover:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:active:not([disabled], [readOnly])) .clear-button__hidden,
    :host(:focus-within:not([disabled], [readOnly])) .clear-button__hidden {
        opacity: 0;
    }

    :host([appearance="filled"]) .root {
        background: ${fillColor};
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: ${neutralFillHover};
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: ${disabledCursor};
    }

    :host([disabled]) {
        opacity: ${disabledOpacity};
    }

    :host([disabled]) .control {
        border-color: ${neutralStrokeRest};
    }
`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .root,
                :host([appearance="filled"]) .root {
                    forced-color-adjust: none;
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.FieldText};
                }
                :host(:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover:not([disabled])) .root,
                :host([appearance="filled"]:hover) .root {
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.Highlight};
                }
                .start,
                .end {
                    fill: currentcolor;
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .root,
                :host([appearance="filled"]:hover[disabled]) .root {
                    border-color: ${SystemColors.GrayText};
                    background: ${SystemColors.Field};
                }
                :host(:focus-within:enabled) .root {
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 1px ${SystemColors.Highlight} inset;
                }
                input::placeholder {
                    color: ${SystemColors.GrayText};
                }
            `
        ),
        new DirectionalStyleSheetBehavior(ltrStyles, rtlStyles)
    );
