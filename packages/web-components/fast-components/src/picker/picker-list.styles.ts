import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralStrokeInputFilledActive,
    neutralStrokeInputFilledHover,
    neutralStrokeInputFilledRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

/**
 * Styles for Picker list
 * @public
 */
export const pickerListStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host {
            display: flex;
            flex-direction: row;
            column-gap: calc(${designUnit} * 1px);
            row-gap: calc(${designUnit} * 1px);
            flex-wrap: wrap;
            width: max-content;
        }

        ::slotted([role="combobox"]) {
            min-width: 260px;
            width: auto;
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            background: ${neutralFillRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid ${neutralStrokeInputFilledRest};
            height: calc(${heightNumber} * 1px);
            font-family: ${bodyFont};
            outline: none;
            user-select: none;
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            padding: 0 calc(${designUnit} * 2px + 1px);
        }

        :host(:not([disabled]):hover) ::slotted([role="combobox"]) {
            background: ${neutralFillHover};
            border-color: ${neutralStrokeInputFilledHover};
            color: ${neutralForegroundHover};
        }

        :host(:not([disabled]):active) ::slotted([role="combobox"]) {
            background: ${neutralFillActive};
            border-color: ${neutralStrokeInputFilledActive};
            color: ${neutralForegroundActive};
        }

        :host(:focus-within) ::slotted([role="combobox"]),
        :host(:focus-within:hover) ::slotted([role="combobox"]) {
            background: ${neutralFillFocus};
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px)
                ${focusStrokeOuter} inset;
            color: ${neutralForegroundFocus};
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                ::slotted([role="combobox"]:active) {
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.Highlight};
                }

                ::slotted([role="combobox"]:focus-within) {
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 1px ${SystemColors.Highlight} inset;
                }

                ::slotted(input:placeholder) {
                    color: ${SystemColors.GrayText};
                }
            `
        )
    );
