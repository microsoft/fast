import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentForegroundActiveBehavior,
    heightNumber,
    neutralForegroundRestBehavior,
} from "../styles/index";

export const CalendarStyles = css`
    ${display("block")} :host {
        --cell-height: calc(${heightNumber} * 1px);
        --weekday-background: transparent;
        --weekday-color: inherit;
        --current-day: ${accentForegroundActiveBehavior.var};
        --current-day-border: none;
        --current-day-background: none;
        --inactive-day-color: ${SystemColors.GrayText};
    }

    .title {
        font-size: 1.5em;
        padding: 5px 0;
        text-align: center;
    }

    .days {
        border-left: var(--cell-border);
        border-top: var(--cell-border);
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }

    .week-day {
        background-color: var(--weekday-background);
        border-bottom: var(--cell-border);
        color: var(--weekday-color);
        padding: 5px 0;
        text-align: center;
    }

    .week-day:nth-child(7) {
        border-right: var(--cell-border);
    }

    .day {
        box-sizing: border-box;
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        height: var(--cell-height);
        padding: 5px;
        vertical-align: top;
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
`.withBehaviors(accentForegroundActiveBehavior, neutralForegroundRestBehavior);
