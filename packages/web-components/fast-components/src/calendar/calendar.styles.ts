import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/index";
import {
    accentForegroundActive,
    designUnit,
    foregroundOnAccentActive,
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
        --selected-day-color: ${accentForegroundActive};
        --selected-day-outline: 1px solid ${accentForegroundActive};
        --cell-padding: calc(${designUnit} * 1px);
        --cell-line-height: ${typeRampBaseLineHeight};
        text-align: center;
    }

    .title {
        font-size: ${typeRampPlus3FontSize};
        padding: var(--cell-padding);
    }

    .week-days,
    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-left: var(--cell-border, none);
        border-bottom: none;
        padding: 0;
    }

    .week-day {
        background-color: var(--weekday-background);
        color: var(--weekday-color, inherit);
        padding: var(--cell-padding);
        text-align: center;
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        border-top: var(--cell-border);
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
    }

    .day.off {
        color: var(--inactive-day-color);
        background: var(--inactive-day-background);
    }

    .day.disabled {
        color: var(--disabled-day-color);
        background: var(--disabled-day-background);
        outline: var(--disabled-day-outline);
    }

    .day.selected {
        color: var(--selected-day-color);
        background: var(--selected-day-background);
        outline: var(--selected-day-outline);
    }

    .date {
        padding: var(--cell-padding);
    }

    .today .date {
        background: ${accentForegroundActive};
        color: ${foregroundOnAccentActive};
        border-radius: 50%;
        margin: 0 auto;
        width: var(--cell-line-height);
    }

    .today.off .date {
        background: transparent;
        color: inherit;
        width: auto;
    }
`;
