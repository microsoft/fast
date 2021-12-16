import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    TextFieldOptions,
} from "@microsoft/fast-foundation";
import { designUnit } from "../design-tokens";
import {
    inputFilledForcedColorStyles,
    inputFilledStyles,
    inputForcedColorStyles,
    inputStateStyles,
    inputStyles,
} from "../styles";
import { appearanceBehavior } from "../utilities/behaviors";

export const searchFilledStyles: (
    context: ElementDefinitionContext,
    definition: TextFieldOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: TextFieldOptions) =>
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
export const searchStyles = (context, definition) =>
    css`
        ${display("inline-block")}
        ${inputStyles(context, definition, ".root")}
        ${inputStateStyles(context, definition, ".root")}
        .root {
            display: flex;
            flex-direction: row;
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
            position: absolute;
            right: 0;
            top: 1px;
            height: calc(100% - 2px);
            opacity: 0;
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
`.withBehaviors(
        appearanceBehavior("filled", searchFilledStyles(context, definition)),
        forcedColorsStylesheetBehavior(
            css`
                ${inputForcedColorStyles(context, definition, ".root")}
            `
        )
    );
