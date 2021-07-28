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
} from "../design-tokens";
import { heightNumber } from "../styles/index";

export const pickerListItemStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
:host {
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

:host(:${focusVisible}) {
    border-color: ${focusStrokeOuter};
    background: ${neutralLayer3};
    color: ${neutralForegroundRest};
}

:host(:hover) {
    background: ${neutralLayer3};
    color: ${neutralForegroundRest};
}

:host([aria-selected="true"]) {
    background: ${accentFillActive};
    color: ${foregroundOnAccentActive};
}`.withBehaviors(forcedColorsStylesheetBehavior(css``));
