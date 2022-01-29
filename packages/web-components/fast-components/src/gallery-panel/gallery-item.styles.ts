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
 *
 * @public
 */
export const galleryItemStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        .gallery-item {
            width: 100%;
            height: 100%;
            contain: strict;
        }
        .gallery-item-image {
            margin: 30px 20px 10px 20px;
            position: absolute;
            height: 160px;
            width: 160px;
        }
        .gallery-item-title {
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            height: calc(${heightNumber} * 1px);
            padding: calc(${designUnit} * 5px) calc(${designUnit} * 4px);
            color: ${neutralForegroundHint};
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css``));
