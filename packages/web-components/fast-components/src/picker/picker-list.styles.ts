import { css, ElementStyles } from "@microsoft/fast-element";
import {
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
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
} from "../design-tokens.js";
import { heightNumber } from "../styles/index.js";

/**
 * Styles for Picker list
 * @public
 */
export const pickerListStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        :host {
            display: flex;
            flex-direction: row;
            column-gap: calc(${designUnit} * 1px);
            row-gap: calc(${designUnit} * 1px);
            flex-wrap: wrap;
        }

        ::slotted([role="combobox"]) {
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

        ::slotted([role="combobox"]:active) { {
            background: ${neutralFillInputHover};
            border-color: ${accentFillActive};
        }

        ::slotted([role="combobox"]:focus-within) {
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 1px ${focusStrokeOuter} inset;
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
