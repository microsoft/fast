import { html, repeat } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import type { Calendar } from "./calendar";

/**
 * The template for the {@link @microsoft/fast-foundation#(Calendar:class)} component.
 * @public
 */
export const CalendarTemplate: ViewTemplate<Calendar> = html`
    <template>
        ${startTemplate}
        <div class="title" part="title">
            ${x => x.getLocaleMonth()} ${x => x.getLocaleYear()}
        </div>
        <div class="days" part="days">
            ${repeat(
                x => x.getLocaleWeekDays(),
                html`
                    <div class="week-day">${x => x}</div>
                `
            )}
            ${x => {
                const getLocaleDay = x.getLocaleDay.bind(x);
                const weeks = x.getDays().reduce(
                    (str, day) =>
                        `${str}
                    <div class="day${day.month !== x.month ? ` off` : ``}${
                            x.isToday(day.year, day.month, day.day) ? ` today` : ``
                        }" data-year="${day.year}" data-month="${
                            day.month - 1
                        }" data-day="${day.day}">
                        <div>${getLocaleDay(day.month, day.day, day.year)}</div>
                        ${x.isToday(day.year, day.month, day.day) ? `<slot></slot>` : ``}
                        <slot name="${day.month}-${day.day}-${day.year}"></slot>
                    </div>
                    `,
                    ``
                );

                return html`
                    ${weeks}
                `;
            }}
        </div>
        ${endTemplate}
    </template>
`;
