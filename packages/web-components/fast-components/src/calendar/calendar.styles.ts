import { css } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    heightNumber,
    neutralForegroundRestBehavior,
} from "../styles/index";

export const CalendarStyles = css`
    :host {
        display: inline-block;
        --cell-width: calc(${heightNumber} * 1px);
        --cell-height: calc(${heightNumber} * 1px);
        --current-day: ${accentForegroundRestBehavior.var};
    }
    :host .title {
        font-size: 1.5em;
        text-align: center;
    }

    :host .week-day {
        float: left;
        border: var(--cell-border);
        border-bottom: 0;
        overflow: hidden;
    }

    :host .week-day div {
        width: var(--cell-width);
        display: inline-block;
        text-align: center;
        padding: 10px 0;
        background: var(--weekday-background);
    }

    :host .week {
        border-left: var(--cell-border);
        text-align: center;
    }

    :host .day {
        float: left;
        width: var(--cell-width);
        height: var(--cell-height);
        box-sizing: border-box;
        border-right: var(--cell-border);
        border-bottom: var(--cell-border);
        vertical-align: top;
        text-align: left;
    }

    :host .day.off {
        color: #666;
    }

    :host .day.today {
        color: var(--current-day);
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior
);
