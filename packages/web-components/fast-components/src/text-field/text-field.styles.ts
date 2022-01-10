import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    TextFieldOptions,
} from "@microsoft/fast-foundation";
import { typeRampBaseLineHeight } from "../design-tokens";
import {
    densityComponentHorizontalBetweenPadding,
    inputFilledForcedColorStyles,
    inputFilledStyles,
    inputForcedColorStyles,
    inputStateStyles,
    inputStyles,
    typeRampBaseVisualHeight,
} from "../styles";
import { appearanceBehavior } from "../utilities/behaviors";

export const textFieldFilledStyles: (
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
 * Styles for Text Field
 * @public
 */
export const textFieldStyles = (context, definition) =>
    css`
        ${display("inline-block")}
        ${inputStyles(context, definition, ".root")}
        ${inputStateStyles(context, definition, ".root")}

        .root {
            display: flex;
            flex-direction: row;
            gap: calc(${densityComponentHorizontalBetweenPadding} * 1px);
        }

        .control {
            -webkit-appearance: none;
            color: inherit;
            background: transparent;
            border: 0;
            margin-top: calc((${typeRampBaseVisualHeight} - ${typeRampBaseLineHeight}) / 2);
            margin-bottom: calc((${typeRampBaseVisualHeight} - ${typeRampBaseLineHeight}) / 2);
            padding: 0;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
        }

        .start,
        .end {
            display: flex;
            margin: auto;
        }
  `.withBehaviors(
        appearanceBehavior("filled", textFieldFilledStyles(context, definition)),
        forcedColorsStylesheetBehavior(
            css`
                ${inputForcedColorStyles(context, definition, ".root")}
            `
        )
    );
