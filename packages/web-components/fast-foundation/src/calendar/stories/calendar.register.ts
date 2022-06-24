import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Calendar } from "../calendar.js";
import {
    CalendarTitleTemplate,
    calendarTemplate as template,
} from "../calendar.template.js";

const styles = () => css`
    :host {
        --cell-border: none;
        --cell-height: calc(var(--height-number) * 1px);
        --selected-day-outline: 1px solid var(--accent-foreground-active);
        --selected-day-color: var(--accent-foreground-active);
        --selected-day-background: var(--neutral-fill-rest);
        --cell-padding: calc(var(--design-unit) * 1px);
        --disabled-day-opacity: var(--disabled-opacity);
        --inactive-day-opacity: var(--disabled-opacity);
        display: block;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        color: var(--neutral-foreground-rest);
    }
    .title {
        font-size: var(--type-ramp-plus3-font-size);
        line-height: var(--type-ramp-plus3-line-height);
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
        grid-gap: calc(var(--design-unit) * 1px);
        margin-top: calc(var(--design-unit) * 1px);
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
        background: var(--neutral-fill-rest);
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
        cursor: var(--disabled-cursor);
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
        color: var(--foreground-on-accent-active);
        background: var(--accent-foreground-active);
    }
    .today.inactive .date {
        background: transparent;
        color: inherit;
        width: auto;
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Calendar.compose({
            baseName: "calendar",
            template,
            styles,
            title: CalendarTitleTemplate,
        })()
    );
