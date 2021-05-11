import { css } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    heightNumber,
    neutralFillRestBehavior,
    neutralForegroundRestBehavior,
} from "../styles/index";

export const CalendarStyles = css`
    :host {
        display: inline-block;
        --cell-height: calc(${heightNumber} * 1px);
        --current-day: ${accentForegroundRestBehavior.var};
        --weekday-color: #2b2b2b;
    }
    .title {
        font-size: 1.5em;
        text-align: center;
        padding: 5px 0;
    }

    .days {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        border-left: var(--cell-border);
        border-top: var(--cell-border);
    }

    .week-day {
        background-color: var(--weekday-color);
        text-align: center;
        padding: 5px 0;
    }

    .day {
        height: var(--cell-height);
        box-sizing: border-box;
        border-right: var(--cell-border);
        border-bottom: var(--cell-border);
        vertical-align: top;
        text-align: left;
        padding: 5px;
    }

    .day.off {
        color: #666;
    }

    .today {
        color: var(--current-day);
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior
);
