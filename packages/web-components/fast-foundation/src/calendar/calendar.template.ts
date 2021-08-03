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
        <div
            class="title"
            part="title"
            aria-label="${x =>
                x.dateFormatter.getDate(`${x.month}-2-${x.year}`, {
                    month: "long",
                    year: "numeric",
                })}"
        >
            <span part="month">${x => x.dateFormatter.getMonth(x.month)}</span>
            <span part="year">${x => x.dateFormatter.getYear(x.year)}</span>
        </div>
    </slot>
`;

/**
 * Calendar weekday label template
 * @public
 */
export const CalendarWeekdayTemplate: ViewTemplate = html`
    <div class="week-day" part="week-day">
        ${x => x}
    </div>
`;

/**
 * A calendar day template
 * @public
 */
export const CalendarDayTemplate: ViewTemplate<CalendarDateInfo> = html`
    <div
        part="day"
        aria-label="${(x, c) =>
            ("dateFormatter" in c.parent
                ? c
                : c.parentContext
            ).parent.dateFormatter.getDate(`${x.month}-${x.day}-${x.year}`, {
                month: "long",
                day: "numeric",
            })}"
        class="${(x, c) =>
            ("getDayClassNames" in c.parent
                ? c
                : c.parentContext
            ).parent.getDayClassNames(x)}"
        @click="${(x, c) => c.parentContext.parent.handleDateSelect(x)}"
    >
        <div
            class="date"
            part="${(x, c) => {
                const isToday = c.parent.isToday || c.parentContext.parent.isToday;
                return !!isToday(`${x.month}-${x.day}-${x.year}`) ? `today` : `date`;
            }}"
        >
            ${(x, c) =>
                ("dateFormatter" in c.parent
                    ? c
                    : c.parentContext
                ).parent.dateFormatter.getDay(x.day)}
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
            ${repeat(x => x.dateFormatter.getWeekdays(), CalendarWeekdayTemplate)}
        </div>
        <div class="days" part="days">
            ${repeat(x => x.getDays(), CalendarDayTemplate)}
        </div>
        ${endTemplate}
    </template>
`;
