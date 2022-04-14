import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/index.js";
import {
    accentForegroundActive,
    bodyFont,
    designUnit,
    disabledOpacity,
    foregroundOnAccentActive,
    neutralFillRest,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
} from "../design-tokens.js";

/**
 * Styles for Calendar
 * @public
 */
export const CalendarStyles = css`
    ${display("block")} :host {
        --cell-border: none;
        --cell-height: calc(${heightNumber} * 1px);
        --selected-day-outline: 1px solid ${accentForegroundActive};
        --selected-day-color: ${accentForegroundActive};
        --selected-day-background: ${neutralFillRest};
        --cell-padding: calc(${designUnit} * 1px);
        --disabled-day-opacity: ${disabledOpacity};
        --inactive-day-opacity: ${disabledOpacity};
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        color: ${neutralForegroundRest};
    }

    .title {
        font-size: ${typeRampPlus3FontSize};
        line-height: ${typeRampPlus3LineHeight};
        padding: var(--cell-padding);
        text-align: center;
    }

    .week-days,
    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-left: var(--cell-border, none);
        border-bottom: none;
        padding: 0;
    }

    .interact .week {
        grid-gap: calc(${designUnit} * 1px);
        margin-top: calc(${designUnit} * 1px);
    }

    .day,
    .week-day {
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        padding: var(--cell-padding);
    }

    .week-day {
        text-align: center;
        border-radius: 0;
        border-top: var(--cell-border);
    }

    .day {
        box-sizing: border-box;
        vertical-align: top;
        outline-offset: -1px;
        line-height: var(--cell-line-height);
        white-space: normal;
    }

    .interact .day {
        background: ${neutralFillRest};
        cursor: pointer;
    }

    .day.inactive {
        background: var(--inactive-day-background);
        color: var(--inactive-day-color);
        opacity: var(--inactive-day-opacity);
        outline: var(--inactive-day-outline);
    }

    .day.disabled {
        background: var(--disabled-day-background);
        color: var(--disabled-day-color);
        cursor: ${disabledCursor};
        opacity: var(--disabled-day-opacity);
        outline: var(--disabled-day-outline);
    }

    .day.selected {
        color: var(--selected-day-color);
        background: var(--selected-day-background);
        outline: var(--selected-day-outline);
    }

    .date {
        padding: var(--cell-padding);
        text-align: center;
    }

    .interact .today,
    .today {
        color: ${foregroundOnAccentActive};
        background: ${accentForegroundActive};
    }

    .today.inactive .date {
        background: transparent;
        color: inherit;
        width: auto;
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host {
                --selected-day-outline: 1px solid ${SystemColors.Highlight};
            }

            .day,
            .week-day {
                background: ${SystemColors.Canvas};
                color: ${SystemColors.CanvasText};
                fill: currentcolor;
            }

            .day.selected {
                color: ${SystemColors.Highlight};
            }

            .today .date {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }
        `
    )
);
