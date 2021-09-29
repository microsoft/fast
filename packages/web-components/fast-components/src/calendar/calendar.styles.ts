import { css } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/index";
import {
    accentForegroundActive,
    designUnit,
    foregroundOnAccentActive,
    neutralFillRest,
    neutralForegroundRest,
    typeRampBaseLineHeight,
    typeRampPlus3FontSize,
} from "../design-tokens";

/**
 * Styles used by the calendar title and contents
 * @public
 */
export const CalendarStyles = css`
    ${display("block")} :host {
        --cell-border: none;
        --cell-height: calc(${heightNumber} * 1px);
        --inactive-day-color: ${SystemColors.GrayText};
        --disabled-day-color: ${SystemColors.GrayText};
        --selected-day-border: 1px solid ${accentForegroundActive};
        --selected-day-color: ${accentForegroundActive};
        --selected-day-background: ${neutralFillRest};
        --cell-padding: calc(${designUnit} * 1px);
        --cell-line-height: ${typeRampBaseLineHeight};
        color: ${neutralForegroundRest};
    }

    :host .interact {
        --inactive-day-color: currentcolor;
        --inactive-day-background: none;
    }

    .title {
        font-size: ${typeRampPlus3FontSize};
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

    .week-day {
        background-color: var(--weekday-background);
        color: var(--weekday-color, inherit);
        padding: var(--cell-padding);
        text-align: center;
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        border-top: var(--cell-border);
        border-radius: 0;
    }

    .day {
        box-sizing: border-box;
        height: var(--cell-height);
        padding: var(--cell-padding);
        vertical-align: top;
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        outline-offset: -1px;
        line-height: var(--cell-line-height);
        border-radius: 0;
        white-space: normal;
        border-radius: calc(${designUnit} * 1px);
    }

    .interact .day {
        background: ${neutralFillRest};
        cursor: pointer;
    }

    .day.off {
        color: var(--inactive-day-color);
        background: var(--inactive-day-background);
    }

    .day.disabled {
        color: var(--disabled-day-color);
        outline: var(--disabled-day-outline);
    }

    .day.selected {
        color: var(--selected-day-color);
        background: var(--selected-day-background);
        border: var(--selected-day-border);
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

    .today.off .date {
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
