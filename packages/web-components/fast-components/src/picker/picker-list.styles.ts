import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const pickerListStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        .picker-list {
            display: flex;
            flex-direction: row;
            column-gap: calc(${designUnit} * 1px);
            row-gap: calc(${designUnit} * 1px);
            flex-wrap: wrap;
            z-index: 1000;
        }

        [role="combobox"] {
            min-width: 260px;
            width: auto;
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            background: ${neutralFillInputRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid ${accentFillRest};
            height: calc(${heightNumber} * 1px);
            font-family: ${bodyFont};
            outline: none;
            user-select: none;
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            padding: 0 calc(${designUnit} * 2px + 1px);
        }

        :active[role="combobox"] {
            background: ${neutralFillInputHover};
            border-color: ${accentFillActive};
        }

        :focus-within[role="combobox"] {
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 1px ${focusStrokeOuter} inset;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                [role="combobox"]:active {
                    background: ${SystemColors.Field};
                    border-color: ${SystemColors.Highlight};
                }
                [role="combobox"]:focus-within {
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 1px ${SystemColors.Highlight} inset;
                }
                input:placeholder {
                    color: ${SystemColors.GrayText};
                }
            `
        )
    );
