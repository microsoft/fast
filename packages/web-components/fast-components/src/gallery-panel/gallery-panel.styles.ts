import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthRest,
    neutralForegroundHint,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles";

/**
 * Styles for Tooltip
 * @public
 */
export const galleryPanelStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        .gallery-title {
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            height: calc(${heightNumber} * 1px);
            padding: calc(${designUnit} * 5px) calc(${designUnit} * 4px);
            color: ${neutralForegroundHint};
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css``));
