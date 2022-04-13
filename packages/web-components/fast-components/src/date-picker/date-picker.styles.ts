import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/index.js";
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
} from "../design-tokens.js";
import { elevation } from "../styles/elevation.js";
import { DirectionalStyleSheetBehavior } from "../styles/direction.js";
import { DatePickerOptions } from "./index.js";

/**
 * RTL specific styles
 * @param context - ElementDefinitionContext
 * @param definition - FoundationElementDefinition
 * @returns
 */
const rtl = (context, definition) => css`
    .picker-title .title-action::part(control) {
        aign-items: right;
    }

    .reset-text {
        float: left;
    }
`;

/**
 * Default LTR styles
 * @param context - ElementDefinitionContext
 * @param definition - FoundationElementDefinition
 * @returns
 */
const ltr = (context, definition) => css`
    .picker-title .title-action::part(control) {
        aign-items: left;
    }

    .reset-text {
        float: right;
    }
`;

/**
 * Styles for the fast-date-picker component
 * @param context - control context
 * @param definition - foundation element definition
 * @returns styles
 *
 * @public
 */
export const DatePickerStyles: FoundationElementTemplate<
    ElementStyles,
    DatePickerOptions
> = (context: ElementDefinitionContext, definition: FoundationElementDefinition) =>
    css`
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
            display: inline-flex;
            color: ${neutralForegroundRest};
            gap: calc(${designUnit} * 5px);
        }

        .calendar {
            width: calc(${designUnit} * (8 + ${density}) * 7px);
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
            width: calc(${designUnit} * (8 + ${density}) * 7px);
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
            justify-content: start;
            font-weight: bold;
        }

        .picker-grid {
            display: grid;
            height: calc(${designUnit} * (8 + ${density}) * 7px);
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
            background: transparent;
            margin: 30px 0 0;
        }

        .time-picker {
            width: calc(${designUnit} * (8 + ${density}) * 7px);
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
    `.withBehaviors(
        new DirectionalStyleSheetBehavior(
            ltr(context, definition),
            rtl(context, definition)
        )
    );
