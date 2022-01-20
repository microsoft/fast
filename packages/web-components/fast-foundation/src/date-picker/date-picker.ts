import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import {
    DateFormatter,
    DayFormat,
    MonthFormat,
    WeekdayFormat,
    YearFormat,
} from "../calendar/date-formatter";

export type DatePickerOptions = FoundationElementDefinition & {};

export class DatePicker extends FoundationElement {
    /**
     * Date picker type
     * @public
     */
    @attr
    public type: "date" | "datetime-local" | "month" | "year" | "time" = "date";

    /**
     * Value for the date-picker
     * @public
     */
    @attr
    public value: string;
    public valueChanged(previous, next) {
        if (previous !== next && next) {
            const date = new Date(next);
            if (date.getTime()) {
                this.selectedDate = Object.assign({}, this.selectedDate, {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                });
                this.setViews();
            }
        }
    }

    @attr
    public reset: string = "Go to today";

    /**
     * date formatter utitlity for getting localized strings
     * @public
     */
    public dateFormatter: DateFormatter = new DateFormatter();

    /**
     * Locale information including market(language and country), calendar type and numbering system
     * @public
     */
    @attr
    public locale: string = "en-US";
    private localeChanged(): void {
        this.dateFormatter.locale = this.locale;
    }

    /**
     * Name of the form element
     * @public
     */
    @attr
    public name: string;

    /**
     * Placeholder text when no value is set
     * @public
     */
    @attr
    public placeholder: string;

    /**
     * Appearance, filled or outlined
     * @public
     */
    @attr
    public appearance: string;

    /**
     * If the date is editable
     * @public
     */
    @attr
    public readonly: boolean;

    /**
     * If the form element is disabled
     * @public
     */
    @attr
    public disabled: boolean;

    /**
     * If the form element is required
     * @public
     */
    @attr
    public required: boolean;

    /**
     * Minimum allowed date
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public min: number;

    /**
     * Maximum allowed date
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public max: number;

    /**
     * Should the text field be editable or only the picker allowed
     * @public
     */
    @attr({ attribute: "allow-text-input" })
    public allowTextInput: boolean = false;

    /**
     * Formatting of the day string
     * @public
     */
    @attr({ attribute: "day-format" })
    public dayFormat: DayFormat = "numeric";

    /**
     * Formatting for the weekday
     * @public
     */
    @attr({ attribute: "weekday-format" })
    public weekdayFormat: WeekdayFormat;

    /**
     * Formatting for the month
     * @public
     */
    @attr({ attribute: "month-format" })
    public monthFormat: MonthFormat = "numeric";

    /**
     * Formatting for the year
     * @public
     */
    @attr({ attribute: "year-format" })
    public yearFormat: YearFormat = "numeric";

    /**
     * Formatting for hour used in timestamps
     */
    @attr({ attribute: "hour-format" })
    public hourFormat = "numeric";

    /**
     * Formatting for mintues used in timestamps
     * @public
     */
    @attr({ attribute: "minute-format" })
    public minuteFormat = "numeric";

    /**
     * Wether there should time output should be 24hour formatted
     */
    @attr({ attribute: "hour-12" })
    public hour12: boolean = true;

    /**
     * Selected date object
     *
     */
    @observable
    private selectedDate: {
        day: number;
        month: number;
        year: number;
        hour: number;
        minute: number;
        meridian: "AM" | "PM";
    };

    /**
     * Currently selected date
     */
    @observable
    public date: string;

    /**
     * The month of the calendar to show
     */
    @observable
    public monthView: number = new Date().getFullYear();

    /**
     * The year for the month selector
     */
    @observable
    public yearView: number = Math.floor(new Date().getFullYear() / 10) * 10;

    /**
     * Dates that are not selectable
     * @public
     */
    @attr({ attribute: "disabled-dates" })
    public disabledDates: string;

    @observable
    public textField;

    /**
     * The Calendar month
     * @public
     */
    @observable
    public calendarMonth: number = new Date().getMonth() + 1;

    /**
     * The Calendar year
     * @public
     */
    @observable
    public calendarYear: number = new Date().getFullYear();

    /**
     * Switches the calendar to the previous month
     */
    public previousCalendar(): void {
        if (this.calendarMonth <= 1) {
            this.calendarMonth = 12;
            this.calendarYear -= 1;
        } else {
            this.calendarMonth -= 1;
        }
    }

    /**
     * Switches the calendar to the next month
     */
    public nextCalendar(): void {
        if (this.calendarMonth >= 12) {
            this.calendarMonth = 1;
            this.calendarYear += 1;
        } else {
            this.calendarMonth += 1;
        }
    }

    /**
     * Resets the calendar to the current month of the current year
     */
    public resetCalendar(): void {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        this.calendarMonth = month;
        this.calendarYear = year;
        this.monthView = year;
        this.yearView = Math.floor(year / 10) * 10;
    }

    setViews(): void {
        const { year, month, day } = this.selectedDate;
        if (year && month && day) {
            this.date = `${month}-${day}-${year}`;
        }
        this.calendarMonth = month;
        this.calendarYear = year;
        this.monthView = year;
        this.yearView = Math.floor(year / 10) * 10;
    }

    /**
     * Method used to return hours, minutes and meridians for the time selector
     * @returns - 1 - 12 hours
     *
     * @public
     */
    public getTimes(): {
        hours: {
            text: string;
            value: number;
            action: () => void;
        }[];
        minutes: {
            text: string;
            value: number;
            action: () => void;
        }[];
        meridians: {
            text: string;
            action: () => void;
        }[];
    } {
        const date = Date.bind(Date, 2000, 1, 1);
        /* Creates an array of hours data */
        const hours: { text: string; value: number; action: () => void }[] = new Array(12)
            .fill(null)
            .map((_, index) => {
                const hour = this.selectedDate?.hour || new Date().getHours();
                let value = hour - (hour > 12 ? 12 : 0) + index;
                if (value > 12) {
                    value -= 12;
                }
                const hourDate = new date(value, 1);
                const text = this.dateFormatter
                    .getDate(hourDate, { hour: "numeric" })
                    .replace(/ *[ap][m]/i, "");

                return {
                    text,
                    value,
                    action: () => this.handleHourClicked(value),
                };
            });

        /* Creates an arry of minutes data */
        const minutes = new Array(60).fill(null).map((_, index) => {
            const minute = this.selectedDate?.minute ?? new Date().getMinutes();
            const value = (minute + index) % 60;
            const minuteDate = new date(1, value);
            const text = this.dateFormatter.getDate(minuteDate, { minute: "2-digit" });

            return {
                text,
                value,
                action: () => this.handleMinuteClicked(value),
            };
        });

        /* An array of meridians */
        const meridians = [
            { text: "AM", action: () => this.handleMeridianClicked("AM") },
            { text: "PM", action: () => this.handleMeridianClicked("PM") },
        ];
        const meridian =
            this.selectedDate?.meridian || (new Date().getHours() >= 12 ? "PM" : "AM");
        if (meridian === "PM") {
            meridians.reverse();
        }

        return {
            hours,
            minutes,
            meridians,
        };
    }

    /**
     * Helper function used to create a matrix as a multi-dimensional array from a flat array
     * @param array - a flat array to build into a multi-demensional array
     * @param itemsPerRow - the maximum numer of items in each array row
     * @returns
     */
    public arrayToMatrix(array: any[], itemsPerRow: number): any[][] {
        return array.reduce((matrix, item, index) => {
            if (index % itemsPerRow === 0) {
                matrix.push([item]);
            } else {
                matrix[matrix.length - 1].push(item);
            }
            return matrix;
        }, []);
    }

    /**
     * Creates an array of selectable months for the month picker
     * @returns an array of month labels
     */
    public getMonths() {
        return new Array(12).fill(null).map((_, index) => {
            return {
                action: () => this.handleMonthClicked(index + 1, this.monthView),
                selected:
                    this.calendarMonth === index + 1 &&
                    this.calendarYear === this.yearView,
                text: this.dateFormatter.getMonth(index + 1, "short"),
            };
        });
    }

    /**
     * Creates an array of selectable years for the year picker
     * @returns an array of years starting from this.yearRange
     */
    public getYears() {
        return new Array(12).fill(null).map((_, index) => {
            const year = this.yearView + index;
            const text = this.dateFormatter.getYear(year);
            return {
                action: () => this.handleYearClicked(year),
                text,
            };
        });
    }

    /**
     * Boolean to indicate if the user is interacting with the date-picker
     */
    private overFlyout: boolean = false;

    /**
     * Boolean to indicate the flyout is open
     */
    @observable
    private flyoutOpen: boolean = false;

    /**
     * Opens the flyout used for picking a date or time
     * @param force - Should flyoutOpen ignore the overFlyout boolean
     */
    public openFlyout(force: boolean = false) {
        this.flyoutOpen = force || !!this.overFlyout;
    }

    /**
     * Closes the flyout used for picking a date or time
     * @param force - Should flyoutClose ignore the overFlyout boolean
     */
    public closeFlyout(force: boolean = false) {
        if (force || !this.overFlyout) {
            this.flyoutOpen = false;
        }
    }

    /**
     * If the flyout is open, it will close. If the flyout is closed, it will open
     * @param force - Should the toggle ignore the overFlyout boolean
     */
    public toggleFlyout(force: boolean = false) {
        this[`${this.flyoutOpen ? "close" : "open"}Flyout`](force);
    }

    /**
     * Should show the year picker when date selecting
     */
    @observable
    public showYearPicker: boolean = false;

    /**
     * Handler for selected date in the calendar
     * @param date - The date clicked
     */
    public handleDateClicked({ day, month, year }): void {
        this.setValue({ day, month, year });
    }

    /**
     * Handler for selecting a month in the month picker
     * @param month - The month clicked
     */
    public handleMonthClicked(month: number, year: number): void {
        this.calendarMonth = month;
        this.calendarYear = year;

        if (this.type === "month") {
            this.setValue({ month, year });
        }
    }

    /**
     * Handler for selecting a year in the year picker
     * @param year - The year clicked
     */
    public handleYearClicked(year: number): void {
        this.monthView = year;

        if (this.type === "year") {
            this.setValue({ year });
        } else if (this.type === "date") {
            this.showYearPicker = false;
        }
    }

    /**
     * Handler for selecting an hour in the time picker
     * @param hour - The hour clicked
     */
    public handleHourClicked(hour: number): void {
        this.setValue({ hour });
    }

    /**
     * Handler for selecting the minutes in the time picker
     * @param minute - The minute clicked
     */
    public handleMinuteClicked(minute: number): void {
        this.setValue({ minute });
    }

    /**
     * Handler for selecting the meridian in the time picker
     * @param meridian - The meridian clicked
     */
    public handleMeridianClicked(meridian: "AM" | "PM"): void {
        this.setValue({ meridian });
    }

    /**
     * Validates and sets values
     * @param values - object containing key-values to update
     */
    public setValue(values) {
        this.selectedDate = Object.assign({}, this.selectedDate, values);
        const now = new Date();
        const {
            year = now.getFullYear(),
            month = now.getMonth() + 1,
            day = now.getDate(),
            minute = now.getMinutes(),
            meridian,
        } = this.selectedDate;
        let hour = this.selectedDate.hour || now.getHours();
        if (meridian === "PM" && hour <= 12) {
            hour += 12;
        }
        const date = new Date(year, month - 1, day, hour, minute);
        const formatting: {
            year?: YearFormat;
            month?: MonthFormat;
            day?: DayFormat;
            weekday?: WeekdayFormat;
            hour?;
            minute?;
        } = {};

        const keys =
            this.type === "time"
                ? { hour, minute }
                : this.type === "datetime-local"
                ? { year, month, day, hour, minute }
                : values;

        for (const key in keys) {
            const formatKey = `${key}Format`;
            formatting[key] = this[formatKey];
        }

        if (this.weekdayFormat && this.type.indexOf("date") >= 0) {
            formatting.weekday = this.weekdayFormat;
        }

        const dateString = this.dateFormatter.getDate(date, formatting);
        if (this.type === "time") {
            if (
                !this.selectedDate.hour ||
                this.selectedDate.minute === undefined ||
                !this.selectedDate.meridian
            ) {
                return;
            }

            this.closeFlyout(true);
        }

        this.value = dateString;

        if (this.type !== "datetime-local") {
            this.closeFlyout(true);
        }
    }

    /**
     * Component has finished rendering
     */
    public connectedCallback(): void {
        super.connectedCallback();

        window.addEventListener("click", () => this.closeFlyout());
    }

    /**
     * Component unloads
     */
    disconnectedCallback(): void {
        window.removeEventListener("click", () => this.closeFlyout());
    }
}
