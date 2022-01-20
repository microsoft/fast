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
        position: relative;
    }
    .flyout {
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: calc(${designUnit} * 5px);
        background-color: ${fillColor};
        ${elevation}
        z-index: 1;
        display: none;
        color: ${neutralForegroundRest};
    }

    .flyout.show {
        display: inline-flex;
    }

    .flyout > * + * {
        margin: 0 0 0 20px;
    }

    .calendar {
        width: 240px;
        position: relative;
    }

    .calendar::part(title) {
        font-size: ${typeRampBaseFontSize};
        text-align: left;
    }

    .calendar-controls {
        position: absolute;
        right: 0;
        top: 0;
    }

    .calendar-control {
        background: transparent;
    }

    .picker {
        width: 240px;
    }

    .picker-title {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto auto;
    }

    .picker-title .title-action,
    .picker-title .arrow {
        background: transparent;
    }

    .picker-title .title-action::part(control) {
        aign-items: left;
        justify-content: left;
        font-weight: bold;
    }

    .picker-grid {
        display: grid;
        height: 210px;
    }

    .picker-row {
        border: none;
    }

    .picker-cell {
        display: flex;
        align-items: center;
        justify-content: left;
        text-align: center;
        cursor: pointer;
    }

    .picker-title .title-action:hover,
    .picker-title .arrow:hover,
    .picker-cell:hover {
        background: ${neutralFillRest};
    }

    .reset {
        float: right;
        background: transparent;
        margin: 30px 0 0;
    }

    .time-picker {
        width: 260px;
        box-sizing: border-box;
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr 20px 1fr 1fr;
    }

    .time-list {
        overflow-y: hidden;
    }

    .time-list:hover {
        overflow-y: auto;
    }

    .time-separate {
        padding: 15px 8px;
    }
`;
