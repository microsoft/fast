import { attr, FASTElement } from "@microsoft/fast-element";

/**
 * enum representing the different month and weekday formats
 */
export type DateStyle = "long" | "narrow" | "short";

/**
 * Information about a month
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
 */
export type CalendarInfo = MonthInfo & {
    previous: MonthInfo;
    next: MonthInfo;
};

export class Calendar extends FASTElement {
    /**
     * Today's date
     * @internal
     */
    private today: Date = new Date();

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
    @attr
    public month: number = this.today.getMonth() + 1;

    /**
     * Year of the month to display
     * @public
     */
    @attr
    public year: number = this.today.getFullYear();

    /**
     * Format style for the week day labels
     */
    @attr
    public weekdayFormat: DateStyle = "short";

    /**
     * Format style for the month label
     */
    @attr
    public monthFormat: DateStyle = "long";

    /**
     * The number of miliseconds in a day
     * @internal
     */
    private oneDayInMs: number = 86400000;

    /**
     * An evaluation of whether or not the calendar is rendered as RTL
     * @internal
     */
    public isRTL(): boolean {
        return this.locale.match(/$(he|ar)-/i) !== null;
    }

    /**
     * Gets data needed to render about a calendar month as well as the previous and next months
     * @param month - month of the calendar
     * @param year - year of the calendar
     * @returns - an object with data about the current and 2 surrounding months
     * @public
     */
    public getMonthInfo(
        year: number = this.year,
        month: number = this.month
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
     * @returns a localized string for requested element
     */
    public formatter(
        date: Date | string | number[] = [this.month, 1, this.year],
        options: Intl.DateTimeFormatOptions,
        locale: string = this.locale
    ): string {
        if (typeof date === "string") {
            date = new Date(date);
        } else if (Array.isArray(date)) {
            date = new Date(
                date.reduce((dt, val) => `${dt}${dt !== "" ? "-" : ""}${val}`, "")
            );
        }
        const optionsWithTimeZone = Object.assign({}, { timeZone: "utc" }, options);

        return new Intl.DateTimeFormat(locale, optionsWithTimeZone).format(date);
    }

    /**
     * Gets a localized month name
     * @param month - number of the month, january = 1, febuary = 2, etc
     * @returns a localized string representing the name of the month
     * @public
     */
    public getLocaleMonth(month: number = this.month): string {
        return this.formatter([month, 1, this.year], { month: this.monthFormat });
    }

    /**
     * Gets a localized year
     * @param year - year of the calendar to display
     * @returns a localized string repesenting the year
     * @public
     */
    public getLocaleYear(year: number = this.year): string {
        return this.formatter([this.month, 1, year], { year: "numeric" });
    }

    /**
     * Gets a localized day
     * @param day - day
     * @returns a localized version of the day
     * @public
     */
    public getLocaleDay(
        month: number = this.month,
        day: number = this.today.getDate(),
        year: number = this.year
    ): string {
        return this.formatter([month, day, year], { day: "numeric" });
    }

    /**
     * Gets a localized list of weekday names
     * @returns an array of localized strings representing the names of the weekdays
     * @public
     */
    public getLocaleWeekDays(): string[] {
        return Array(7)
            .fill(null)
            .map((_, day) =>
                this.formatter([1, day + 1, 2017], { weekday: this.weekdayFormat })
            );
    }

    /**
     * Simple check if a date is the current date
     * @param year - year of the date to check
     * @param month - month of the date to check
     * @param day - day of the date to check
     * @returns true if the date is the current date otherwise returns false
     */
    public isToday(year: number, month: number, day: number): boolean {
        return (
            day == this.today.getDate() &&
            month == this.today.getMonth() + 1 &&
            year == this.today.getFullYear()
        );
    }

    /**
     * A list of calendar days
     * @param info - an object containing the information needed to render a calendar month
     * @returns a list of days in a calendar month
     */
    public getDays(info: CalendarInfo = this.getMonthInfo()) {
        const { start, length, previous, next } = info;
        const days: any = [];
        let day = 1 - start;

        while (days.length < 42) {
            const { month, year } = day < 1 ? previous : day > length ? next : info;
            const date = {
                day: day < 1 ? previous.length + day : day > length ? day - length : day,
                month,
                year,
            };

            days.push(date);
            day++;
        }

        return days;
    }

    /**
     * Helper function that can extract the date that was clicked on a calendar
     * @param mouseEvent - a mouse click event
     * @returns the date clicked
     */
    public getDateClicked(mouseEvent: any): string | null | undefined {
        if (mouseEvent && mouseEvent.path) {
            const day: HTMLElement = mouseEvent
                .composedPath()
                .find(node => node.className && node.className.indexOf("day") >= 0);

            return day.getAttribute("data-date");
        }
    }
}
