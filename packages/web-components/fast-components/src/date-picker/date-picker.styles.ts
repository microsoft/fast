import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/index";
import {
    accentForegroundActive,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    fillColor,
    foregroundOnAccentActive,
    neutralFillRest,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
} from "../design-tokens";
import { elevation } from "../styles/elevation";
import { DirectionalStyleSheetBehavior } from "../styles";

export const datePickerStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        --elevation: 14;
    }
    .flyout {
        display: inline-flex;
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: calc(${designUnit} * 5px);
        background-color: ${fillColor};
        ${elevation}
    }

    .flyout > * + * {
        margin: 0 0 0 20px;
    }

    .calendar {
        width: 240px;
    }

    .calendar::part(title) {
        font-size: ${typeRampBaseFontSize};
    }

    .picker {
        width: 240px;
    }

    .picker-title {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto auto;
    }

    .picker-grid {
        display: grid;
        height: 210px;
    }

    .picker-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
`;
