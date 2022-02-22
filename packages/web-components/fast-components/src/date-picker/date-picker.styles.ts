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
    density,
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

/**
 * Styles for the fast-date-picker component
 * @param context - control context
 * @param definition - foundation element definition
 * @returns styles
 *
 * @public
 */
export const DatePickerStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        --elevation: 14;
        --panel-size: calc(${designUnit} * (8 + ${density}) * 7px);
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
        gap: calc(${designUnit} * 5px);
    }

    .flyout.show {
        display: inline-flex;
    }

    .calendar {
        width: var(--panel-size);
        position: relative;
    }

    .calendar-title-wrap {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
    }

    .calendar-title {
        background: transparent;
        cursor: default;
    }

    .calendar-title::part(control) {
        justify-content: start;
        font-weight: bold;
    }

    .calendar-control {
        background: transparent;
    }

    .picker {
        width: var(--panel-size);
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
        justify-content: start;
        font-weight: bold;
    }

    .picker-grid {
        display: grid;
        height: var(--panel-size);
    }

    .picker-row {
        border: none;
    }

    .picker-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
    }

    .title-action {
        cursor: default;
    }

    .interactive-title {
        cursor: pointer;
    }

    .interactive-title:hover,
    .picker-title .arrow:hover,
    .picker-cell:hover {
        background: ${neutralFillRest};
    }

    .reset-text {
        float: right;
        background: transparent;
        margin: 30px 0 0;
    }

    .time-picker {
        width: var(--panel-size);
        box-sizing: border-box;
        padding: calc(${designUnit} * 2px);
        display: grid;
        grid-template-columns: 1fr 20px 1fr 1fr;
        gap: calc(${designUnit} * 2px);
    }

    .time-list {
        overflow-y: hidden;
    }

    .time-list:hover {
        overflow-y: auto;
    }

    .time-separator {
        padding: 15px 0 0;
        text-align: center;
    }
`;
