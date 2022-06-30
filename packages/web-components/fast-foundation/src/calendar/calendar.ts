import {
    attr,
    FASTElement,
    nullableNumberConverter,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import { keyEnter } from "@microsoft/fast-web-utilities";
import type { StartEndOptions, TemplateElementDependency } from "../patterns/index.js";
import { DayFormat, MonthFormat, WeekdayFormat, YearFormat } from "./calendar.options.js";
import { DateFormatter } from "./date-formatter.js";

/**
 * Information about a month
 * @public
 */
export type MonthInfo = {
    month: number;
    year: number;
    length: number;
    start: number;
};

/**
 * Calendar information needed for rendering
 * including the next and previous months
 * @public
 */
export type CalendarInfo = MonthInfo & {
    previous: MonthInfo;
    next: MonthInfo;
};

/**
 * Caldendar date info
 * used to represent a date
 * @public
 */
export type CalendarDateInfo = {
    day: number;
    month: number;
    year: number;
    disabled?: boolean;
    selected?: boolean;
};

/**
 * Calendar weekday text.
 * @public
 */
export type WeekdayText = { text: string; abbr?: string };

/**
 * Calendar configuration options
 * @public
 */
export type CalendarOptions = StartEndOptions & {
    dataGridCell: TemplateElementDependency;
    dataGridRow: TemplateElementDependency;
    dataGrid: TemplateElementDependency;
    title?: SyntheticViewTemplate | string;
};

/**
 * Calendar component
 *
 * @slot - The default slot for calendar content
 * @fires dateselected - Fires a custom 'dateselected' event when Enter is invoked via keyboard on a date
 *
 * @public
 */
export class FASTCalendar extends FASTElement {
    /**
     * date formatter utitlity for getting localized strings
     * @public
     */
    public dateFormatter: DateFormatter = new DateFormatter();

    /**
     * Readonly attribute for turning off data-grid
     * @public
     */
    @attr({ mode: "boolean" })
    public readonly: boolean = false;

    /**
     * String repesentation of the full locale including market, calendar type and numbering system
     * @public
     */
    @attr
    public locale: string = "en-US";
    protected localeChanged(): void {
        this.dateFormatter.locale = this.locale;
    }

    /**
     * Month to display
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public month: number = new Date().getMonth() + 1;

    /**
     * Year of the month to display
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public year: number = new Date().getFullYear();

    /**
     * Format style for the day
     * @public
     */
    @attr({ attribute: "day-format", mode: "fromView" })
    public dayFormat: DayFormat = DayFormat.numeric;
    protected dayFormatChanged(): void {
        this.dateFormatter.dayFormat = this.dayFormat;
    }

    /**
     * Format style for the week day labels
     * @public
     */
    @attr({ attribute: "weekday-format", mode: "fromView" })
    public weekdayFormat: WeekdayFormat = WeekdayFormat.short;
    protected weekdayFormatChanged(): void {
        this.dateFormatter.weekdayFormat = this.weekdayFormat;
    }

    /**
     * Format style for the month label
     * @public
     */
    @attr({ attribute: "month-format", mode: "fromView" })
    public monthFormat: MonthFormat = MonthFormat.long;
    protected monthFormatChanged(): void {
        this.dateFormatter.monthFormat = this.monthFormat;
    }

    /**
     * Format style for the year used in the title
     * @public
     */
    @attr({ attribute: "year-format", mode: "fromView" })
    public yearFormat: YearFormat = YearFormat.numeric;
    protected yearFormatChanged(): void {
        this.dateFormatter.yearFormat = this.yearFormat;
    }

    /**
     * Minimum number of weeks to show for the month
     * This can be used to normalize the calendar view
     *  when changing or across multiple calendars
     * @public
     */
    @attr({ attribute: "min-weeks", converter: nullableNumberConverter })
    public minWeeks: number = 0;

    /**
     * A list of dates that should be shown as disabled
     * @public
     */
    @attr({ attribute: "disabled-dates" })
    public disabledDates: string = "";

    /**
     * A list of dates that should be shown as highlighted
     * @public
     */
    @attr({ attribute: "selected-dates" })
    public selectedDates: string = "";

    /**
     * The number of miliseconds in a day
     * @internal
     */
    private oneDayInMs: number = 86400000;

    /**
     * Gets data needed to render about a calendar month as well as the previous and next months
     * @param year - year of the calendar
     * @param month - month of the calendar
     * @returns - an object with data about the current and 2 surrounding months
     * @public
     */
    public getMonthInfo(
        month: number = this.month,
        year: number = this.year
    ): CalendarInfo {
        const getFirstDay = (date: Date) =>
            new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const getLength = (date: Date) => {
            const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            return new Date(nextMonth.getTime() - this.oneDayInMs).getDate();
        };
        const thisMonth: Date = new Date(year, month - 1);
        const nextMonth: Date = new Date(year, month);
        const previousMonth: Date = new Date(year, month - 2);

        return {
            length: getLength(thisMonth),
            month,
            start: getFirstDay(thisMonth),
            year,
            previous: {
                length: getLength(previousMonth),
                month: previousMonth.getMonth() + 1,
                start: getFirstDay(previousMonth),
                year: previousMonth.getFullYear(),
            },
            next: {
                length: getLength(nextMonth),
                month: nextMonth.getMonth() + 1,
                start: getFirstDay(nextMonth),
                year: nextMonth.getFullYear(),
            },
        };
    }

    /**
     * A list of calendar days
     * @param info - an object containing the information needed to render a calendar month
     * @param minWeeks - minimum number of weeks to show
     * @returns a list of days in a calendar month
     * @public
     */
    public getDays(
        info: CalendarInfo = this.getMonthInfo(),
        minWeeks: number = this.minWeeks
    ): CalendarDateInfo[][] {
        minWeeks = minWeeks > 10 ? 10 : minWeeks;
        const { start, length, previous, next } = info;
        const days: CalendarDateInfo[][] = [];
        let dayCount = 1 - start;

        while (
            dayCount < length + 1 ||
            days.length < minWeeks ||
            days[days.length - 1].length % 7 !== 0
        ) {
            const { month, year } =
                dayCount < 1 ? previous : dayCount > length ? next : info;
            const day =
                dayCount < 1
                    ? previous.length + dayCount
                    : dayCount > length
                    ? dayCount - length
                    : dayCount;
            const dateString = `${month}-${day}-${year}`;
            const disabled = this.dateInString(dateString, this.disabledDates);
            const selected = this.dateInString(dateString, this.selectedDates);
            const date: CalendarDateInfo = {
                day,
                month,
                year,
                disabled,
                selected,
            };
            const target = days[days.length - 1];
            if (days.length === 0 || target.length % 7 === 0) {
                days.push([date]);
            } else {
                target.push(date);
            }
            dayCount++;
        }

        return days;
    }

    /**
     * A helper function that checks if a date exists in a list of dates
     * @param date - A date objec that includes the day, month and year
     * @param datesString - a comma separated list of dates
     * @returns - Returns true if it found the date in the list of dates
     * @public
     */
    public dateInString(date: Date | string, datesString: string): boolean {
        const dates = datesString.split(",").map(str => str.trim());
        date =
            typeof date === "string"
                ? date
                : `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;

        return dates.some(d => d === date);
    }

    /**
     * Creates a class string for the day container
     * @param date - date of the calendar cell
     * @returns - string of class names
     * @public
     */
    public getDayClassNames(date: CalendarDateInfo, todayString?: string): string {
        const { day, month, year, disabled, selected } = date;
        const today = todayString === `${month}-${day}-${year}`;
        const inactive = this.month !== month;

        return [
            "day",
            today && "today",
            inactive && "inactive",
            disabled && "disabled",
            selected && "selected",
        ]
            .filter(Boolean)
            .join(" ");
    }

    /**
     * Returns a list of weekday labels
     * @returns An array of weekday text and full text if abbreviated
     * @public
     */
    public getWeekdayText(): WeekdayText[] {
        const weekdayText: {
            text: string;
            abbr?: string;
        }[] = this.dateFormatter.getWeekdays().map(text => ({ text }));

        if (this.weekdayFormat !== "long") {
            const longText = this.dateFormatter.getWeekdays("long");
            weekdayText.forEach((weekday, index) => {
                weekday.abbr = longText[index];
            });
        }

        return weekdayText;
    }

    /**
     * Emits the "date-select" event with the day, month and year.
     * @param date - Date cell
     * @public
     */
    public handleDateSelect(event: Event, day: CalendarDateInfo): void {
        event.preventDefault;
        this.$emit("dateselected", day);
    }

    /**
     * Handles keyboard events on a cell
     * @param event - Keyboard event
     * @param date - Date of the cell selected
     */
    public handleKeydown(event: KeyboardEvent, date: CalendarDateInfo): boolean {
        if (event.key === keyEnter) {
            this.handleDateSelect(event, date);
        }

        return true;
    }
}
