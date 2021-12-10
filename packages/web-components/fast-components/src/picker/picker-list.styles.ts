import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
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

        ::slotted([role="combobox"]:hover) {
            background: ${neutralFillHover};
            border-color: ${neutralStrokeInputFilledHover};
            color: ${neutralForegroundHover};
        }

        ::slotted([role="combobox"]:active) {
            background: ${neutralFillActive};
            border-color: ${neutralStrokeInputFilledActive};
            color: ${neutralForegroundActive};
        }

        ::slotted([role="combobox"]:focus-within) {
            background: ${neutralFillFocus};
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px)
                ${focusStrokeOuter} inset;
            color: ${neutralForegroundFocus};
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                ::slotted(input:placeholder) {
                    color: ${SystemColors.GrayText};
                }
            `
        )
    );
