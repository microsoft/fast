import { html, repeat } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import {
    Calendar,
    CalendarDateInfo,
    CalendarDayTemplate,
    CalendarTitleTemplate,
    CalendarWeekdayTemplate,
    endTemplate,
    startTemplate,
} from "@microsoft/fast-foundation";

/**
 * A helper function to build a matrix of days in the month by week
 * @param calendar - A calendar object to extract days of the month from
 * @returns a multidimensional array that includes the days of the month broken up by week
 */
const getWeeks = (calendar: Calendar): CalendarDateInfo[][] =>
    calendar
        .getDays()
        .reduce(
            (
                weeks: CalendarDateInfo[][],
                day: CalendarDateInfo,
                index: number
            ): CalendarDateInfo[][] => {
                if (index % 7 === 0) {
                    weeks.push([]);
                }
                weeks[weeks.length - 1].push(day);
                return weeks;
            },
            []
        );

/**
 * template for a calendar grid row containing a week of days
 */
const FASTCalendarWeekTamplate: ViewTemplate<CalendarDateInfo[]> = html`
    <fast-calendar-grid-row
        class="days"
        part="week"
        role="row"
        row-type="default"
        grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
    >
        ${repeat(
            (x: CalendarDateInfo[]) => x,
            html`
                <fast-calendar-grid-cell
                    tabindex="-1"
                    role="gridcell"
                    grid-column="${(x, c) => c.index + 1}"
                    day=${x => x.day}
                    month=${x => x.month}
                    year=${x => x.year}
                >
                    ${CalendarDayTemplate}
                </fast-calendar-grid-cell>
            `,
            { positioning: true }
        )}
    </fast-calendar-grid-row>
`;

/**
 * Over arching template that includes the title and builds the calendar into a calendar grid
 */
export const FASTCalendarTemplate: ViewTemplate<Calendar> = html`
    <template>
        ${startTemplate} ${CalendarTitleTemplate}
        <slot></slot>
        <div class="week-days" part="week-days">
            ${repeat(x => x.getLocaleWeekDays(), CalendarWeekdayTemplate)}
        </div>
        <fast-calendar-grid generate-header="none">
            ${repeat(getWeeks, FASTCalendarWeekTamplate)}
        </fast-calendar-grid>
        ${endTemplate}
    </template>
`;
