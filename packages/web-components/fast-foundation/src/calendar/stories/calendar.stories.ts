import { html } from "@microsoft/fast-element";
import type { Meta, Story, StoryArgs } from "../../__test__/helpers.js";
import { renderComponent } from "../../__test__/helpers.js";
import type { FASTCalendar } from "../calendar.js";
import {
    DayFormat,
    MonthFormat,
    WeekdayFormat,
    YearFormat,
} from "../calendar.options.js";

const storyTemplate = html<StoryArgs<FASTCalendar>>`
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
    >
        ${x => x.storyContent}
    </fast-calendar>
`;

export default {
    title: "Calendar",
    args: {
        readonly: false,
    },
    argTypes: {
        dayFormat: { control: "select", options: Object.values(DayFormat) },
        disabledDates: { control: "text" },
        locale: { control: "text" },
        minWeeks: { control: "number", min: 0 },
        month: { control: "number", min: 1, max: 12 },
        monthFormat: { control: "select", options: Object.values(MonthFormat) },
        readonly: { control: "boolean" },
        selectedDates: { control: "text" },
        storyContent: { table: { disable: true } },
        weekdayFormat: { control: "select", options: Object.values(WeekdayFormat) },
        year: { control: "number" },
        yearFormat: { control: "select", options: Object.values(YearFormat) },
    },
} as Meta<FASTCalendar>;

export const Calendar: Story<FASTCalendar> = renderComponent(storyTemplate).bind({});
