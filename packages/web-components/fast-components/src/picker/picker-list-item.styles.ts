import { css, ElementStyles } from "@microsoft/fast-element";
import {
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActive,
    bodyFont,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentActive,
    neutralForegroundRest,
    neutralLayer3,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { heightNumber } from "../styles/index.js";

/**
 * Styles for Picker list item
 * @public
 */
export const pickerListItemStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
:host {
    display: flex;
    align-items: center;
    justify-items: center;
    font-family: ${bodyFont};
    border-radius: calc(${controlCornerRadius} * 1px);
    border: calc(${focusStrokeWidth} * 1px) solid transparent;
    box-sizing: border-box;
    color: ${neutralForegroundRest};
    cursor: pointer;
    fill: currentcolor;
    font-size: ${typeRampBaseFontSize};
    height: calc(${heightNumber} * 1px);
    line-height: ${typeRampBaseLineHeight};
    outline: none;
    overflow: hidden;
    padding: 0 calc(${designUnit} * 2.25px);
    user-select: none;
    white-space: nowrap;
}

:host(:${focusVisible}),
:host(:hover) {
    background: ${neutralLayer3};
    color: ${neutralForegroundRest};
}

:host(:focusVisible) {
    border-color: ${focusStrokeOuter};
}

:host([aria-selected="true"]) {
    background: ${accentFillActive};
    color: ${foregroundOnAccentActive};
}`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }

                :host([disabled]),
                :host([disabled]:not([aria-selected="true"]):hover) {
                    background: ${SystemColors.Canvas};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }
            `
        )
    );
