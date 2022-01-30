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
 * Styles for
 * @public
 */
export const galleryStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        .gallery {
            height: 400px;
            width: 100%;
        }
        .gallery-item {
            position: absolute;
            height: 300px;
            width: 200px;
        }
        .gallery-list {
            display: block;
            width: 100%;
            height: 300px;
            overflow-x: scroll;
            overflow-y: hidden;
        }
        .gallery-title {
        }
    `.withBehaviors(forcedColorsStylesheetBehavior(css``));
