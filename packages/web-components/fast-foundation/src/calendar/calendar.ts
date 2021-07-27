import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";

/**
 * enum representing the different month and weekday formats
 * @public
 */
export type DateStyle = "long" | "narrow" | "short";

/**
 * enum representing the different year formats
 * @public
 */
export type YearFormat = "numeric" | "2-digit";

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
 * Calendar component
 * @public
 */
export class Calendar extends FoundationElement {
    /**
     * String repesentation of the full locale including market, calendar type and numbering system
     * @public
     */
    @attr
    public locale: string = "en-US";

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
    @attr({ attribute: "day-format" })
    public dayFormat: "numeric" | "2-digit" = "numeric";

    /**
     * Format style for the week day labels
     * @public
     */
    @attr({ attribute: "weekday-format" })
    public weekdayFormat: DateStyle = "short";

    /**
     * Format style for the month label
     * @public
     */
    @attr({ attribute: "month-format" })
    public monthFormat: DateStyle = "long";

    /**
     * Format style for the year used in the title
     * @public
     */
    @attr({ attribute: "year-format" })
    public yearFormat: YearFormat = "numeric";

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
     * An evaluation of whether or not the calendar is rendered as RTL
     * @internal
     */
    public isRTL(locale: string = this.locale): boolean {
        return locale.trim().match(/\b(he|ar)-/i) !== null;
    }

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
        const getFirstDay: (Date) => number = (date: Date) =>
            new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const getLength = date => {
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
     * International formatter for getting year, month and weekday names
     * @param date - date to format
     * @param options - elements to format and timezone
     * @param locale - locale settings
     * @returns a localized string for requested element
     */
    public localeFormatter(
        date: Date | string = `${this.month}-1-${this.year}`,
        format: Intl.DateTimeFormatOptions = {
            month: this.monthFormat,
            year: this.yearFormat,
            day: this.dayFormat,
        },
        locale: string = this.locale
    ): string {
        if (typeof date === "string") {
            date = new Date(date);
        }
        const optionsWithTimeZone = Object.assign({}, { timeZone: "utc" }, format);

        return new Intl.DateTimeFormat(locale, optionsWithTimeZone).format(date);
    }

    /**
     * Gets a localized month name
     * @param month - number of the month, january = 1, febuary = 2, etc
     * @param format - DateStyle = "long" | "narrow" | "short"
     * @param locale - locale settings
     * @returns a localized string representing the name of the month
     * @public
     */
    public getMonth(
        month: number = this.month,
        format: DateStyle = this.monthFormat,
        locale: string = this.locale
    ): string {
        return this.localeFormatter(`${month}-3-2017`, { month: format }, locale);
    }

    /**
     * Gets a localized year
     * @param year - year of the calendar to display
     * @returns a localized string repesenting the year
     * @public
     */
    public getYear(
        year: number = this.year,
        format: YearFormat = this.yearFormat,
        locale: string = this.locale
    ): string {
        return this.localeFormatter(`6-1-${year}`, { year: format }, locale);
    }

    /**
     * Gets a localized day
     * @param day - day
     * @returns a localized version of the day
     * @public
     */
    public getDay(
        date: Date | string,
        format: "numeric" | "2-digit" = "numeric",
        locale = this.locale
    ): string {
        return !date ? "" : this.localeFormatter(date, { day: format }, locale);
    }

    /**
     * Gets a localized list of weekday names
     * @param format - DateStyle = "long" | "narrow" | "short": format settings for the weekdays
     * @param locale - locale settings
     * @returns an array of localized strings representing the names of the weekdays
     * @public
     */
    public getWeekDays(
        format: DateStyle = this.weekdayFormat,
        locale = this.locale
    ): { label: string; text: string }[] {
        return Array(7)
            .fill(null)
            .map((_, day) => {
                const date = `1-${day + 1}-2017`;
                return {
                    label: this.localeFormatter(date, { weekday: "long" }, locale),
                    text: this.localeFormatter(date, { weekday: format }, locale),
                };
            });
    }

    /**
     * Simple check if a date is the current date
     * @param date - Date | string | number[]
     * @returns true if the date is the current date otherwise returns false
     * @public
     */
    public isToday(date: Date | string): boolean {
        const today = new Date();
        date = date instanceof Date ? date : new Date(date);

        return (
            date.getDate() == today.getDate() &&
            date.getMonth() == today.getMonth() &&
            date.getFullYear() == today.getFullYear()
        );
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
    ): CalendarDateInfo[] {
        minWeeks = minWeeks > 10 ? 10 : minWeeks;
        const { start, length, previous, next } = info;
        const days: CalendarDateInfo[] = [];
        let dayCount = 1 - start;

        while (
            days.length < start + length ||
            days.length < minWeeks * 7 ||
            days.length % 7 !== 0
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

            days.push(date);
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

        return !!dates.find(d => d === date);
    }

    /**
     * Creates a class string for the day container
     * @param date - date of the calendar cell
     * @returns - string of class names
     * @public
     */
    public getDayClassNames(date: CalendarDateInfo): string {
        const { day, month, year, disabled, selected } = date;
        let className: string = "day";

        if (this.isToday(`${month}-${day}-${year}`)) {
            className += " today";
        }

        if (this.month !== month) {
            className += " off";
        }

        if (disabled) {
            className += " disabled";
        }

        if (selected) {
            className += " selected";
        }

        return className;
    }

    /**
     * Emits the "date-select" event with the day, month and year.
     * @param date - Date cell
     * @public
     */
    public handleDateSelect(day: CalendarDateInfo): void {
        (this as FASTElement).$emit("date-select", day);
    }
}
