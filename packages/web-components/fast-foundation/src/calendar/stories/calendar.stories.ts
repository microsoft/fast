import { html } from "@microsoft/fast-element";
import type { Args, Meta } from "@storybook/html";
import type { FASTCalendar } from "../calendar.js";
import {
    DayFormat,
    MonthFormat,
    WeekdayFormat,
    YearFormat,
} from "../calendar.options.js";

type CalendarStoryArgs = Args & FASTCalendar;
type CalendarStoryMeta = Meta<CalendarStoryArgs>;

const componentTemplate = html<CalendarStoryArgs>`
    <fast-calendar
        ?readonly="${x => x.readonly}"
        day-format="${x => x.dayFormat}"
        disabled-dates="${x => x.disabledDates}"
        locale="${x => x.locale ?? navigator.language}"
        min-weeks="${x => x.minWeeks}"
        month-format="${x => x.monthFormat}"
        month="${x => x.month}"
        readonly="${x => x.readonly}"
        selected-dates="${x => x.selectedDates}"
        weekday-format="${x => x.weekdayFormat}"
        year-format="${x => x.yearFormat}"
    ></fast-calendar>
`;

export default {
    title: "Calendar",
    args: {
        locale: "en-US",
    },
    argTypes: {
        dayFormat: { options: Object.values(DayFormat), control: { type: "select" } },
        disabledDates: { control: { type: "text" } },
        locale: { control: { type: "text" } },
        minWeeks: { control: { type: "text" } },
        month: { control: { type: "number", min: 1, max: 12 } },
        monthFormat: { options: Object.values(MonthFormat), control: { type: "select" } },
        readonly: { control: { type: "boolean" } },
        selectedDates: { control: { type: "text" } },
        weekdayFormat: {
            options: Object.values(WeekdayFormat),
            control: { type: "select" },
        },
        year: { control: { type: "number" } },
        yearFormat: { options: Object.values(YearFormat), control: { type: "select" } },
    },
} as CalendarStoryMeta;

export const Calendar = (args: CalendarStoryArgs) => {
    const storyFragment = new DocumentFragment();
    componentTemplate.render(args, storyFragment);
    return storyFragment.firstElementChild;
};
