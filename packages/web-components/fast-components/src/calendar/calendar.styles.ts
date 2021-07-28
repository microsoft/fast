import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles/index";
import { accentForegroundActive } from "../design-tokens";

/**
 * Styles used by the calendar title and contents
 * @public
 */
export const CalendarStyles = css`
    ${display("block")} :host {
    }

    .days {
        border-left: var(--cell-border, none);
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .week-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-bottom: var(--cell-border, none);
    }

    .title {
        font-size: 1.5em;
        padding: 5px 0;
        text-align: center;
    }

    .week-day {
        background-color: var(--weekday-background, transparent);
        color: var(--weekday-color, inherit);
        padding: 5px 0;
        text-align: center;
    }

    .day {
        box-sizing: border-box;
        height: var(--cell-height, calc(${heightNumber} * 1px));
        padding: 5px;
        vertical-align: top;
        border-bottom: var(--cell-border, none);
        border-right: var(--cell-border, none);
        position: relative;
    }

    .day.off {
        color: var(--inactive-day-color, ${SystemColors.GrayText});
        background: var(--inactive-day-background, transparent);
    }

    .day.disabled {
        color: var(--disabled-day-color, ${SystemColors.GrayText});
        background: var(--disabled-day-background, transparent);
        outline: var(--disabled-day-outline, none);
    }

    .day.selected {
        color: var(--selected-day-color, ${accentForegroundActive});
        background: var(--selected-day-background, transparent);
        outline: var(--selected-day-outline, 1px solid ${accentForegroundActive});
    }

    .today {
        background: var(--current-day-background, transparent);
        color: var(--current-day-color, ${accentForegroundActive});
        outline: var(--current-day-border, none);
        outline-offset: -1px;
    }
`;
