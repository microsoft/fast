import { css, ElementStyles } from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
    TextFieldOptions,
} from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch";
import {
    bodyFont,
    controlCornerRadius,
    density,
    designUnit,
    neutralFillRecipe,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRecipe,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import {
    heightNumber,
    inputFilledForcedColorStyles,
    inputFilledStyles,
    inputForcedColorStyles,
    inputStateStyles,
    inputStyles,
} from "../styles";
import { appearanceBehavior } from "../utilities/behaviors";

const clearButtonHover = DesignToken.create<Swatch>("clear-button-hover").withDefault(
    (target: HTMLElement) => {
        const buttonRecipe = neutralFillStealthRecipe.getValueFor(target);
        const inputRecipe = neutralFillRecipe.getValueFor(target);
        return buttonRecipe.evaluate(target, inputRecipe.evaluate(target).hover).hover;
    }
);

const clearButtonActive = DesignToken.create<Swatch>("clear-button-active").withDefault(
    (target: HTMLElement) => {
        const buttonRecipe = neutralFillStealthRecipe.getValueFor(target);
        const inputRecipe = neutralFillRecipe.getValueFor(target);
        return buttonRecipe.evaluate(target, inputRecipe.evaluate(target).hover).active;
    }
);

export const searchFilledStyles: FoundationElementTemplate<
    ElementStyles,
    TextFieldOptions
> = (context, definition) =>
    css`
        ${inputFilledStyles(context, definition, ".root")}
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                ${inputFilledForcedColorStyles(context, definition, ".root")}
            `
        )
    );

/**
 * Styles for Search
 * @public
 */
export const searchStyles: FoundationElementTemplate<ElementStyles, TextFieldOptions> = (
    context,
    definition
) =>
    css`
        ${display("inline-block")}
        ${inputStyles(context, definition, ".root")}
        ${inputStateStyles(context, definition, ".root")}
        .root {
            display: flex;
            flex-direction: row;
            align-items: baseline;
        }

        .control {
            -webkit-appearance: none;
            color: inherit;
            background: transparent;
            border: 0;
            height: calc(100% - 4px);
            margin-top: auto;
            margin-bottom: auto;
            padding: 0 calc(${designUnit} * 2px + 1px);
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
        }

        .control::-webkit-search-cancel-button {
            -webkit-appearance: none;
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
        }

        ::slotted([slot="end"]) {
            height: 100%
        }

        ::slotted(svg) {
            margin-inline-end: 11px;
            margin-inline-start: 11px;
            margin-top: auto;
            margin-bottom: auto;
        }

        .clear-button {
            display: inline-flex;
            align-items: center;
            height: calc(100% - 2px);
            opacity: 0;
            margin: 1px;
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
            background: ${clearButtonHover};
        }

        :host([appearance="filled"]) .clear-button:active {
            background: ${clearButtonActive};
        }

        .input-wrapper {
            display: flex;
            position: relative;
            width: 100%;
            height: 100%;
        }

        .end {
            height: calc(100% - 2px);
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
`.withBehaviors(
        appearanceBehavior("filled", searchFilledStyles(context, definition)),
        forcedColorsStylesheetBehavior(
            css`
                ${inputForcedColorStyles(context, definition, ".root")}
            `
        )
    );
