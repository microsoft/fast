/**
 * enum representing the different day formats
 * @public
 */
export type DayFormat = "2-digit" | "numeric";

/**
 * enum representing the different weekday formats
 * @public
 */
export type WeekdayFormat = "long" | "narrow" | "short";

/**
 * enum representing the different month formats
 * @public
 */
export type MonthFormat = "2-digit" | "long" | "narrow" | "numeric" | "short";

/**
 * enum representing the different year formats
 * @public
 */
export type YearFormat = "2-digit" | "numeric";

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
    public dayFormat: DayFormat;

    /**
     * Formatting for the weekday labels
     * @public
     */
    public weekdayFormat: WeekdayFormat;

    /**
     * Formatting for the month
     * @public
     */
    public monthFormat: MonthFormat;

    /**
     * Formatting for the year
     * @public
     */
    public yearFormat: YearFormat;

    constructor(props?) {
        /**
         * Add properties on construction
         */
        for (const key in props) {
            if (key in this) {
                this[key] = props[key];
            }
        }
    }

    /**
     *
     * @param date - a valide date as either a Date, string, objec or a DateFormatter
     * @param format - The formatting for the string
     * @param locale - locale data used for formatting
     * @returns A localized string of the date provided
     * @public
     */
    getDate(
        date: { day: number; month: number; year: number } | string | Date,
        format: Intl.DateTimeFormatOptions = {
            weekday: this.weekdayFormat,
            month: this.monthFormat,
            day: this.dayFormat,
            year: this.yearFormat,
        },
        locale: string = this.locale
    ): string {
        let dateString: string = typeof date === "string" ? date : "";
        if (typeof date !== "string" && !(date instanceof Date)) {
            const { day, month, year } = date;
            dateString = `${month}-${day}-${year}`;
        }

        const dateObj = date instanceof Date ? date : new Date(dateString);
        const optionsWithTimeZone = Object.assign({}, { timeZone: "utc" }, format);

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
    getDay(
        day: number = new Date().getDate(),
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
    getMonth(
        month: number = new Date().getMonth() + 1,
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
    getYear(
        year: number = new Date().getFullYear(),
        format: YearFormat = this.yearFormat,
        locale: string = this.locale
    ): string {
        return this.getDate({ month: 2, day: 2, year }, { year: format }, locale);
    }

    /**
     *
     * @param format - The formatting for the weekdays
     * @param locale - The locale data used for formatting
     * @returns - An array of the weekday labels
     * @public
     */
    getWeekdays(
        format: WeekdayFormat = this.weekdayFormat,
        locale: string = this.locale
    ): string[] {
        return Array(7)
            .fill(null)
            .map((_, day) => {
                const date = `1-${day + 1}-2017`;
                return this.getDate(date, { weekday: format }, locale);
            });
    }
}
