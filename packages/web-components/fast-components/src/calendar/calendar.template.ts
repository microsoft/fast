import { html, repeat } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import {
    Calendar,
    CalendarDateInfo,
    CalendarDayTemplate,
    CalendarTitleTemplate,
    CalendarWeekdayTemplate,
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
 * Template for a calendar grid row including the weekday labels as a header
 */
const FASTCalendarWeekdayTemplate: ViewTemplate<Calendar, CalendarDateInfo[]> = html`
    <fast-calendar-grid-row
        class="days"
        role="row"
        row-type="header"
        grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
    >
        ${repeat(
            (x, c) => x.getLocaleWeekDays(),
            html`
                <fast-calendar-grid-cell
                    tabindex="-1"
                    role="column-header"
                    grid-column=${(x, c) => c.index + 1}
                >
                    ${CalendarWeekdayTemplate}
                </fast-calendar-grid-cell>
            `,
            { positioning: true }
        )}
    </fast-calendar-grid-row>
`;

/**
 * template for a calendar grid row containing a week of days
 */
const FASTCalendarWeekTamplate: ViewTemplate<CalendarDateInfo[]> = html`
    <fast-calendar-grid-row
        class="days"
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
                    grid-column=${(x, c) => c.index + 1}
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
        ${CalendarTitleTemplate}
        <fast-calendar-grid generate-header="none">
            ${FASTCalendarWeekdayTemplate} ${repeat(getWeeks, FASTCalendarWeekTamplate)}
        </fast-calendar-grid>
    </template>
`;
