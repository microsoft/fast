import { ElementViewTemplate, html, repeat, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate, tagFor } from "../patterns/index.js";
import type {
    CalendarDateInfo,
    CalendarOptions,
    FASTCalendar,
    WeekdayText,
} from "./calendar.js";

/**
 * A basic Calendar title template that includes the month and year
 * @returns - A calendar title template
 * @public
 */
export function calendarTitleTemplate(): ViewTemplate<FASTCalendar> {
    return html`
        <div
            class="title"
            part="title"
            aria-label="${(x: FASTCalendar) =>
                x.dateFormatter.getDate(`${x.month}-2-${x.year}`, {
                    month: "long",
                    year: "numeric",
                })}"
        >
            <span part="month">
                ${(x: FASTCalendar) => x.dateFormatter.getMonth(x.month)}
            </span>
            <span part="year">
                ${(x: FASTCalendar) => x.dateFormatter.getYear(x.year)}
            </span>
        </div>
    `;
}

/**
 * Calendar weekday label template
 * @returns - The weekday labels template
 * @public
 */
export function calendarWeekdayTemplate(
    options: CalendarOptions
): ViewTemplate<WeekdayText> {
    const cellTag = tagFor(options.dataGridCell);
    return html<WeekdayText>`
        <${cellTag}
            class="week-day"
            part="week-day"
            tabindex="-1"
            grid-column="${(x, c) => c.index + 1}"
            abbr="${x => x.abbr}"
        >
            ${x => x.text}
        </${cellTag}>
    `;
}

/**
 * A calendar day template
 * @param context - Element definition context for getting the cell tag for calendar-cell
 * @param todayString - A string representation for todays date
 * @returns - A calendar cell template for a given date
 * @public
 */
export function calendarCellTemplate(
    options: CalendarOptions,
    todayString: string
): ViewTemplate<CalendarDateInfo> {
    const cellTag: string = tagFor(options.dataGridCell);
    return html<CalendarDateInfo>`
        <${cellTag}
            class="${(x, c) => c.parentContext.parent.getDayClassNames(x, todayString)}"
            part="day"
            tabindex="-1"
            role="gridcell"
            grid-column="${(x, c) => c.index + 1}"
            @click="${(x, c) => c.parentContext.parent.handleDateSelect(c.event, x)}"
            @keydown="${(x, c) => c.parentContext.parent.handleKeydown(c.event, x)}"
            aria-label="${(x, c) =>
                c.parentContext.parent.dateFormatter.getDate(
                    `${x.month}-${x.day}-${x.year}`,
                    { month: "long", day: "numeric" }
                )}"
        >
            <div
                class="date"
                part="${x =>
                    todayString === `${x.month}-${x.day}-${x.year}` ? "today" : "date"}"
            >
                ${(x, c) => c.parentContext.parent.dateFormatter.getDay(x.day)}
            </div>
            <slot name="${x => x.month}-${x => x.day}-${x => x.year}"></slot>
        </${cellTag}>
    `;
}

/**
 *
 * @param context - Element definition context for getting the cell tag for calendar-cell
 * @param todayString - A string representation for todays date
 * @returns - A template for a week of days
 * @public
 */
export function calendarRowTemplate(
    options: CalendarOptions,
    todayString: string
): ViewTemplate {
    const rowTag = tagFor(options.dataGridRow);
    return html`
        <${rowTag}
            class="week"
            part="week"
            role="row"
            role-type="default"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
        ${repeat(x => x, calendarCellTemplate(options, todayString), {
            positioning: true,
        })}
        </${rowTag}>
    `;
}

/**
 * Interactive template using DataGrid
 * @param context - The templates context
 * @param todayString - string representation of todays date
 * @returns - interactive calendar template
 *
 * @internal
 */
export function interactiveCalendarGridTemplate(
    options: CalendarOptions,
    todayString: string
): ViewTemplate<FASTCalendar> {
    const gridTag: string = tagFor(options.dataGrid);
    const rowTag: string = tagFor(options.dataGridRow);

    return html<FASTCalendar>`
    <${gridTag} class="days interact" part="days" generate-header="none">
        <${rowTag}
            class="week-days"
            part="week-days"
            role="row"
            row-type="header"
            grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
            ${repeat(x => x.getWeekdayText(), calendarWeekdayTemplate(options), {
                positioning: true,
            })}
        </${rowTag}>
        ${repeat(x => x.getDays(), calendarRowTemplate(options, todayString))}
    </${gridTag}>
    `;
}

/**
 * Non-interactive calendar template used for a readonly calendar
 * @param todayString - string representation of todays date
 * @returns - non-interactive calendar template
 *
 * @internal
 */
export function noninteractiveCalendarTemplate(
    options: CalendarOptions,
    todayString: string
): ViewTemplate<FASTCalendar> {
    return html<FASTCalendar>`
        <div class="days" part="days">
            <div class="week-days" part="week-days">
                ${repeat(
                    x => x.getWeekdayText(),
                    html<WeekdayText>`
                        <div class="week-day" part="week-day" abbr="${x => x.abbr}">
                            ${x => x.text}
                        </div>
                    `
                )}
            </div>
            ${repeat<FASTCalendar>(
                x => x.getDays(),
                html<CalendarDateInfo[]>`
                    <div class="week">
                        ${repeat(
                            x => x,
                            html<CalendarDateInfo>`
                                <div
                                    class="${(x, c) =>
                                        c.parentContext.parent.getDayClassNames(
                                            x,
                                            todayString
                                        )}"
                                    part="day"
                                    aria-label="${(x, c) =>
                                        c.parentContext.parent.dateFormatter.getDate(
                                            `${x.month}-${x.day}-${x.year}`,
                                            { month: "long", day: "numeric" }
                                        )}"
                                >
                                    <div
                                        class="date"
                                        part="${x =>
                                            todayString ===
                                            `${x.month}-${x.day}-${x.year}`
                                                ? "today"
                                                : "date"}"
                                    >
                                        ${(x, c) =>
                                            c.parentContext.parent.dateFormatter.getDay(
                                                x.day
                                            )}
                                    </div>
                                    <slot
                                        name="${x => x.month}-${x => x.day}-${x =>
                                            x.year}"
                                    ></slot>
                                </div>
                            `
                        )}
                    </div>
                `
            )}
        </div>
    `;
}

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTCalendar:class)} component.
 *
 * @param context - Element definition context for getting the cell tag for calendar-cell
 * @param definition - Foundation element definition
 * @returns - a template for a calendar month
 * @public
 */
export function calendarTemplate(
    options: CalendarOptions
): ElementViewTemplate<FASTCalendar> {
    const today: Date = new Date();
    const todayString: string = `${
        today.getMonth() + 1
    }-${today.getDate()}-${today.getFullYear()}`;
    return html<FASTCalendar>`
        <template>
            ${startSlotTemplate(options)} ${options.title ?? ""}
            <slot></slot>
            ${when(
                x => x.readonly === false,
                interactiveCalendarGridTemplate(options, todayString)
            )}
            ${when(
                x => x.readonly === true,
                noninteractiveCalendarTemplate(options, todayString)
            )}
            ${endSlotTemplate(options)}
        </template>
    `;
}
