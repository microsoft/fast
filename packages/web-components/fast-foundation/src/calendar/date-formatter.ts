import { DayFormat, MonthFormat, WeekdayFormat, YearFormat } from "./calendar.options.js";

/**
 * Date formatting utility
 * @public
 */
export class DateFormatter {
    /**
     * Localization settings to use for formatting
     * @public
     */
    public locale: string;

    /**
     * Formatting for the day
     * @public
     */
    public dayFormat: DayFormat = DayFormat.numeric;

    /**
     * Formatting for the weekday labels
     * @public
     */
    public weekdayFormat: WeekdayFormat = WeekdayFormat.long;

    /**
     * Formatting for the month
     * @public
     */
    public monthFormat: MonthFormat = MonthFormat.long;

    /**
     * Formatting for the year
     * @public
     */
    public yearFormat: YearFormat = YearFormat.numeric;

    /**
     * Date used for formatting
     */
    public date: Date = new Date();

    constructor(config?: {}) {
        /**
         * Add properties on construction
         */
        if (config) {
            for (const key in config) {
                const value: any = config[key];
                if (key === "date") {
                    this.date = this.getDateObject(value);
                } else {
                    this[key] = value;
                }
            }
        }
    }

    /**
     * Helper function to make sure that the DateFormatter is working with an instance of Date
     * @param date - The date as an object, string or Date insance
     * @returns - A Date instance
     * @public
     */
    public getDateObject(
        date: { day: number; month: number; year: number } | string | Date
    ): Date {
        if (typeof date === "string") {
            const dates = date.split(/[/-]/);
            if (dates.length < 3) {
                return new Date();
            }
            return new Date(
                parseInt(dates[2], 10),
                parseInt(dates[0], 10) - 1,
                parseInt(dates[1], 10)
            );
        } else if ("day" in date && "month" in date && "year" in date) {
            const { day, month, year } = date;
            return new Date(year, month - 1, day);
        }

        return date;
    }

    /**
     *
     * @param date - a valide date as either a Date, string, objec or a DateFormatter
     * @param format - The formatting for the string
     * @param locale - locale data used for formatting
     * @returns A localized string of the date provided
     * @public
     */
    public getDate(
        date: { day: number; month: number; year: number } | string | Date = this.date,
        format: Intl.DateTimeFormatOptions = {
            weekday: this.weekdayFormat,
            month: this.monthFormat,
            day: this.dayFormat,
            year: this.yearFormat,
        },
        locale: string = this.locale
    ): string {
        const dateObj = this.getDateObject(date);
        const optionsWithTimeZone = { timeZone: "utc", ...format };

        return new Intl.DateTimeFormat(locale, optionsWithTimeZone).format(dateObj);
    }

    /**
     *
     * @param day - Day to localize
     * @param format - The formatting for the day
     * @param locale - The locale data used for formatting
     * @returns - A localized number for the day
     * @public
     */
    public getDay(
        day: number = this.date.getDate(),
        format: DayFormat = this.dayFormat,
        locale: string = this.locale
    ): string {
        return this.getDate({ month: 1, day, year: 2020 }, { day: format }, locale);
    }

    /**
     *
     * @param month - The month to localize
     * @param format - The formatting for the month
     * @param locale - The locale data used for formatting
     * @returns - A localized name of the month
     * @public
     */
    public getMonth(
        month: number = this.date.getMonth() + 1,
        format: MonthFormat = this.monthFormat,
        locale: string = this.locale
    ): string {
        return this.getDate({ month, day: 2, year: 2020 }, { month: format }, locale);
    }

    /**
     *
     * @param year - The year to localize
     * @param format - The formatting for the year
     * @param locale - The locale data used for formatting
     * @returns - A localized string for the year
     * @public
     */
    public getYear(
        year: number = this.date.getFullYear(),
        format: YearFormat = this.yearFormat,
        locale: string = this.locale
    ): string {
        return this.getDate({ month: 2, day: 2, year }, { year: format }, locale);
    }

    /**
     *
     * @param weekday - The number of the weekday, defaults to Sunday
     * @param format - The formatting for the weekday label
     * @param locale - The locale data used for formatting
     * @returns - A formatted weekday label
     * @public
     */
    public getWeekday(
        weekday: number = 0,
        format: WeekdayFormat = this.weekdayFormat,
        locale: string = this.locale
    ): string {
        const date = `1-${weekday + 1}-2017`;

        return this.getDate(date, { weekday: format }, locale);
    }

    /**
     *
     * @param format - The formatting for the weekdays
     * @param locale - The locale data used for formatting
     * @returns - An array of the weekday labels
     * @public
     */
    public getWeekdays(
        format: WeekdayFormat = this.weekdayFormat,
        locale: string = this.locale
    ): string[] {
        return Array(7)
            .fill(null)
            .map((_, day) => this.getWeekday(day, format, locale));
    }
}
