import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/index";
import { accentForegroundActive, neutralForegroundRest } from "../design-tokens";

/**
 * Styles used by the calendar title and contents
 * @public
 */
export const CalendarStyles = css`
    ${display("block")} :host {
        --cell-border: none;
        --cell-height: calc(${heightNumber} * 1px);
        --weekday-background: transparent;
        --weekday-color: inherit;
        --current-day: ${accentForegroundActive};
        --current-day-border: none;
        --current-day-background: none;
        --inactive-day-color: ${SystemColors.GrayText};
    }

    .days {
        border-left: var(--cell-border);
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .title {
        font-size: 1.5em;
        padding: 5px 0;
        text-align: center;
    }

    .week-day {
        background-color: var(--weekday-background);
        border-bottom: var(--cell-border);
        color: var(--weekday-color);
        padding: 5px 0;
        text-align: center;
    }

    .day {
        box-sizing: border-box;
        height: var(--cell-height);
        padding: 5px;
        vertical-align: top;
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        position: relative;
    }

    .day.off {
        color: var(--inactive-day-color);
    }

    .today {
        background: var(--current-day-background);
        color: var(--current-day);
        outline: var(--current-day-border);
        outline-offset: -1px;
    }
`;
