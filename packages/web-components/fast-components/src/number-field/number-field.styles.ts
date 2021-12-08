import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
    NumberFieldOptions,
} from "@microsoft/fast-foundation";
import {
    inputFilledForcedColorStyles,
    inputFilledStyles,
    inputForcedColorStyles,
    inputStateStyles,
    inputStyles,
} from "../styles/index";
import { appearanceBehavior } from "../utilities/behaviors";
import { designUnit } from "../design-tokens";

export const numberFieldFilledStyles: FoundationElementTemplate<
    ElementStyles,
    NumberFieldOptions
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
 * Styles for Number Field
 * @public
 */
export const numberFieldStyles: FoundationElementTemplate<
    ElementStyles,
    NumberFieldOptions
> = (context, definition) =>
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

        .start,
        .control,
        .controls,
        .end {
            align-self: center;
        }

        .start,
        .end {
            margin: auto;
            fill: currentcolor;
        }

        .start {
            display: flex;
            margin-inline-start: 11px;
        }

        .end {
            display: flex;
            margin-inline-end: 11px;
        }

        .controls {
            position: relative;
            z-index: 3;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        :host(:hover:not([disabled])) .controls,
        :host(:focus-within:not([disabled])) .controls {
            opacity: 1;
        }

        .step-up,
        .step-down {
            display: flex;
            padding: 0 8px;
            cursor: pointer;
        }
  `.withBehaviors(
        appearanceBehavior("filled", numberFieldFilledStyles(context, definition)),
        forcedColorsStylesheetBehavior(
            css`
                ${inputForcedColorStyles(context, definition, ".root")}
            `
        )
    );
