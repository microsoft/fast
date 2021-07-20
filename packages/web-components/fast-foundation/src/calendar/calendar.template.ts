import { html, repeat } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import type { Calendar, CalendarDateInfo } from "./calendar";

/**
 * A basic Calendar title template that includes the month and year
 * @public
 */
export const CalendarTitleTemplate: ViewTemplate<Calendar> = html`
    <slot name="title">
        <div class="title" part="title">
            <span part="month">${x => x.getLocaleMonth()}</span>
            <span part="year">${x => x.getLocaleYear()}</span>
        </div>
    </slot>
`;

/**
 * Calendar weekday label template
 * @public
 */
export const CalendarWeekdayTemplate: ViewTemplate<Calendar> = html`
    <div class="week-day" part="week-day">${x => x}</div>
`;

/**
 * A calendar day template
 * @public
 */
export const CalendarDayTemplate: ViewTemplate<CalendarDateInfo> = html`
    <div
        part="day"
        class="${(x, c) =>
            c.parent.getDayClassNames
                ? c.parent.getDayClassNames(x)
                : c.parentContext.parent.getDayClassNames(x)}"
        @click="${(x, c) => c.parentContext.parent.handleDateSelect(x)}"
    >
        <div
            class="date"
            part="${(x, c) => {
                const isToday = c.parent.isToday || c.parentContext.parent.isToday;
                return !!isToday(x.year, x.month, x.day) ? `today` : `date`;
            }}"
        >
            ${(x, c) => {
                const parent = c.parent.getLocaleDay ? c.parent : c.parentContext.parent;
                return parent.getLocaleDay(x.month, x.day, x.year);
            }}
        </div>
        <slot name="${x => x.month}-${x => x.day}-${x => x.year}"></slot>
    </div>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#(Calendar:class)} component.
 * @public
 */
export const CalendarTemplate: ViewTemplate<Calendar> = html`
    <template>
        ${startTemplate} ${CalendarTitleTemplate}
        <slot></slot>
        <div class="week-days" part="week-days">
            ${repeat(x => x.getLocaleWeekDays(), CalendarWeekdayTemplate)}
        </div>
        <div class="days" part="days">
            ${repeat(x => x.getDays(), CalendarDayTemplate)}
        </div>
        ${endTemplate}
    </template>
`;
