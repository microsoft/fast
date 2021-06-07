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
        <div class="title" part="title">
            <slot></slot>
            ${x => x.getLocaleMonth()} ${x => x.getLocaleYear()}
        </div>
        <fast-data-grid class="days" generate-header="none">
            <data-grid-row
                role="row"
                row-type="header"
                grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
            >
                ${repeat(
                    x => x.getLocaleWeekDays(),
                    html`
                        <data-grid-cell
                            tabindex="-1"
                            role="columnheader"
                            cell-type="columnheader"
                            class="week-day"
                        >
                            ${x => x}
                        </data-grid-cell>
                    `
                )}
            </data-grid-row>
            ${x => {
                const getLocaleDay = x.getLocaleDay.bind(x);
                const weeks = x.getDays().reduce(
                    (weeks, day) => {
                        const current = () => weeks[weeks.length - 1];
                        if (current().length >= 7) {
                            weeks.push([]);
                        }
                        current().push(day);
                        return weeks;
                    },
                    [[]]
                );

                const weeksGrid = weeks.reduce((htmlOut, week) => {
                    return (htmlOut += `
                            <data-grid-row role="row" row-type="default" grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">
                                ${week.reduce((weekOut, day, index) => {
                                    return (weekOut += `
                                        <data-grid-cell role="gridcell" tabindex="-1" grid-column="${
                                            index + 1
                                        }" class="day${
                                        day.month !== x.month ? ` off` : ``
                                    }${
                                        x.isToday(day.year, day.month, day.day)
                                            ? ` today`
                                            : ``
                                    }" data-year="${day.year}" data-month="${
                                        day.month - 1
                                    }" data-day="${day.day}">
                                            <div>${getLocaleDay(
                                                day.month,
                                                day.day,
                                                day.year
                                            )}</div>
                                            <slot name="${day.month}-${day.day}-${
                                        day.year
                                    }"></slot>
                                        </data-grid-cell>
                                    `);
                                }, "")}
                            </data-grid-row>
                        `);
                }, "");

                return html`
                    ${weeksGrid}
                `;
            }}
        </fast-data-grid>
    </template>
`;
