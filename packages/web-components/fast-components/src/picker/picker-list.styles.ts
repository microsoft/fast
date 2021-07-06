import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    focusVisible,
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
    focusStrokeWidth,
    foregroundOnAccentActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralLayer3,
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
    :host {
        display: flex;
        flex-direction: row;
        column-gap: calc(${designUnit} * 1px);
        row-gap: calc(${designUnit} * 1px);
        flex-wrap: wrap;
        z-index: 1000;
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

    ::slotted(:active[role="combobox"]) {
        background: ${neutralFillInputHover};
        border-color: ${accentFillActive};
    }

    ::slotted(:focus-within[role="combobox"]) {
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 1px ${focusStrokeOuter} inset;
    }
    
    ::slotted([role="listitem"]) {
        min-width: 80px;
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
        margin: 0 calc(${designUnit} * 1px);
        outline: none;
        overflow: hidden;
        padding: 0 calc(${designUnit} * 2.25px);
        user-select: none;
        white-space: nowrap;
    }

    ::slotted(:${focusVisible}[role="listitem"]) {
        border-color: ${focusStrokeOuter};
        background: ${neutralLayer3};
        color: ${neutralForegroundRest};
    }

    ::slotted(:hover[role="listitem"]) {
        background: ${neutralLayer3};
        color: ${neutralForegroundRest};
    }

    ::slotted([role="listitem"][aria-selected="true"]) {
        background: ${accentFillActive};
        color: ${foregroundOnAccentActive};
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            ::slotted(:hover[role="combobox"]) {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.Highlight};
            }
            :slotted(:focus-within:enabled[role="combobox"]) {
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 1px ${SystemColors.Highlight} inset;
            }
            input::placeholder {
                color: ${SystemColors.GrayText};
            }
        `
    )
);
