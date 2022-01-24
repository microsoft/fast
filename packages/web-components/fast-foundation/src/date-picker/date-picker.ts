import {
    attr,
    booleanConverter,
    nullableNumberConverter,
    observable,
} from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import {
    DateFormatter,
    DayFormat,
    MonthFormat,
    WeekdayFormat,
    YearFormat,
} from "../calendar/date-formatter";
import { FormAssociatedDatePicker } from "./date-picker.form-associated";

/**
 * Date picker options
 * @alpha
 */
export type DatePickerOptions = FoundationElementDefinition & {};

/**
 * Struct for holding parsed data from a specific Date
 */
export type DateData = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    meridian?: "AM" | "PM";
};

/**
 * A Date picker component
 * @alpha
 */
export class DatePicker extends FormAssociatedDatePicker {
    /**
     * Date picker type
     * @public
     */
    @attr
    public type: "date" | "datetime-local" | "month" | "year" | "time" = "date";
    public typeChanged(previous, next): void {
        if (next && this.value) {
            this.valueChanged(null, this.value);
        }
    }

    /**
     * Value for the date-picker
     * @public
     */
    @attr
    public value: string;
    public valueChanged(previous, next): void {
        super.valueChanged(previous, next);
        if (previous !== next) {
            if (!previous) {
                this.setValue(next);
            }
        }
    }

    /**
     * Text used for resetting the views back to todays date
     * @public
     */
    @attr({ attribute: "reset-text" })
    public resetText: string = "Go to today";

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
    @attr({ converter: booleanConverter })
    public readonly: boolean;

    /**
     * If the form element is disabled
     * @public
     */
    @attr({ converter: booleanConverter })
    public disabled: boolean;

    /**
     * If the form element is required
     * @public
     */
    @attr({ converter: booleanConverter })
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
    @attr({ attribute: "allow-text-input", converter: booleanConverter })
    public allowTextInput: boolean = true;

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
     * @public
     */
    @attr({ attribute: "hour-format" })
    public hourFormat: "numeric" | "2-digit" = "numeric";

    /**
     * Formatting for mintues used in timestamps
     * @public
     */
    @attr({ attribute: "minute-format" })
    public minuteFormat: "numeric" | "2-digit" = "2-digit";

    /**
     * Wether there should time output should be 24hour formatted
     * @public
     */
    @attr({ attribute: "hour-12", converter: booleanConverter })
    public hour12: boolean = true;

    /**
     * Selected date object
     * @public
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
     * @public
     */
    @observable
    public date: string;

    /**
     * The month of the calendar to show
     * @public
     */
    @observable
    public monthView: number = new Date().getFullYear();

    /**
     * The year for the month selector
     * @public
     */
    @observable
    public yearView: number = Math.floor(new Date().getFullYear() / 10) * 10;

    /**
     * Dates that are not selectable
     * @alpha
     */
    @attr({ attribute: "disabled-dates" })
    public disabledDates: string;

    /**
     * The text field used for date entry
     * @public
     */
    @observable
    public textField;
    public textFieldChanged(previous, next) {
        // Once the textfield is loaded, format it's value
        if (!previous && !!next && this.value) {
            this.textField.value = this.value;
        }
    }

    /**
     * The Calendar month
     * @public
     */
    @observable
    public calendarMonth: number = new Date().getMonth() + 1;
    public calendarMonthChanged(previous, next) {
        this.setCalendarTitle();
    }

    /**
     * The Calendar year
     * @public
     */
    @observable
    public calendarYear: number = new Date().getFullYear();
    public calendarYearChanged(previous, next) {
        this.setCalendarTitle();
    }

    public setCalendarTitle() {
        if (this.calendarMonth && this.calendarYear) {
            const text = this.dateFormatter.getDate(
                `${this.calendarMonth}/1/${this.calendarYear}`,
                { month: "long", year: "numeric" }
            );
            this.calendarTitle = text;
        }
    }

    /**
     * The title text for the calendar
     */
    @observable
    public calendarTitle: string = "";

    /**
     * Switches the calendar to the previous month
     * @public
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
     * @public
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
     * @public
     */
    public resetCalendar(): void {
        const now: Date = new Date();
        const year: number = now.getFullYear();
        this.calendarMonth = now.getMonth() + 1;
        this.calendarYear = year;
        this.monthView = year;
        this.yearView = Math.floor(year / 10) * 10;
    }

    /**
     * Updates the calendar, month picker and year picker views
     * @public
     */
    public setViews(): void {
        if (this.selectedDate) {
            const { year, month, day } = this.selectedDate;
            if (year && month && day) {
                this.date = `${month}-${day}-${year}`;
            }
            this.calendarMonth = month;
            this.calendarYear = year;
            this.monthView = year;
            this.yearView = Math.floor(year / 10) * 10;
        }
    }

    /**
     * Method used to return hours, minutes and meridians for the time selector
     * @returns - an object containing all the hours, minutes and meridians
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
        const date: (hour: number, minute: number) => void = Date.bind(Date, 2000, 1, 1);
        /* Creates an array of hours data */
        const hours: { text: string; value: number; action: () => void }[] = new Array(12)
            .fill(null)
            .map((_, index) => {
                const hour: number = this.selectedDate?.hour || new Date().getHours();
                let value: number = hour - (hour > 12 ? 12 : 0) + index;
                if (value > 12) {
                    value -= 12;
                }
                const hourDate: Date = new date(value, 1);
                const text: string = this.dateFormatter
                    .getDate(hourDate, { hour: "numeric" })
                    .replace(/ *[ap][m]/i, "");

                return {
                    text,
                    value,
                    action: () => this.handleHourClicked(value),
                };
            });

        const partFormatter = new Intl.DateTimeFormat(this.locale, {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hour: "2-digit",
            hour12: true,
            minute: "2-digit",
        });
        /* Creates an arry of minutes data */
        const minutes: { text: string; value: number; action: () => void }[] = new Array(
            60
        )
            .fill(null)
            .map((_, index) => {
                const minute: number =
                    this.selectedDate?.minute ?? new Date().getMinutes();
                const value: number = (minute + index) % 60;
                const minuteDate: Date = new date(1, value);
                const parts = partFormatter.formatToParts(minuteDate);
                const minutePart = parts.find(part => part.type === "minute");
                const text: string = minutePart.value;

                return {
                    text,
                    value,
                    action: () => this.handleMinuteClicked(value),
                };
            });

        const getDayPeriod = hour => {
            const parts = partFormatter.formatToParts(new date(hour, 0));
            const part = parts.find(part => part.type === "dayPeriod");
            return part.value;
        };
        const amText = getDayPeriod(1);
        const pmText = getDayPeriod(13);

        /* An array of meridians */
        const meridians: { text: string; action: () => void }[] = [
            { text: amText, action: () => this.handleMeridianClicked("AM") },
            { text: pmText, action: () => this.handleMeridianClicked("PM") },
        ];
        const meridian: string =
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
     * @public
     */
    public getMonths(): {
        action: () => void;
        selected: boolean;
        text: string;
    }[] {
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
     * @public
     */
    public getYears(): {
        action: () => void;
        text: string;
    }[] {
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
     * @public
     */
    public overFlyout: boolean = false;

    /**
     * Boolean to indicate the flyout is open
     * @public
     */
    @observable
    public flyoutOpen: boolean = false;

    /**
     * Opens the flyout used for picking a date or time
     * @param force - Should flyoutOpen ignore the overFlyout boolean
     * @public
     */
    public openFlyout(force: boolean = false): void {
        this.flyoutOpen = force || !!this.overFlyout;
    }

    /**
     * Closes the flyout used for picking a date or time
     * @param force - Should flyoutClose ignore the overFlyout boolean
     * @public
     */
    public closeFlyout(force: boolean = false): void {
        if (force || !this.overFlyout) {
            this.flyoutOpen = false;
        }
    }

    /**
     * If the flyout is open, it will close. If the flyout is closed, it will open
     * @param force - Should the toggle ignore the overFlyout boolean
     * @public
     */
    public toggleFlyout(force: boolean = false): void {
        this[`${this.flyoutOpen ? "close" : "open"}Flyout`](force);
    }

    /**
     * Should show the calendar
     * @public
     */
    @observable
    public showCalendar: boolean = true;

    /**
     * Should dshow the month picker when date selecting
     * @public
     */
    @observable
    public showMonthPicker: boolean = false;

    /**
     * Method for displaying the month picker
     * @param open - Should open the month picker
     * @returns void
     * @public
     */
    public monthPickerDispay(open: boolean = true): void {
        if (this.type === "month") {
            return;
        }

        this.showMonthPicker = open;
        if (this.type === "datetime-local") {
            this.showCalendar = !open;
        }
    }

    /**
     * Should show the year picker when date selecting
     * @public
     */
    @observable
    public showYearPicker: boolean = false;

    /**
     * Method for displaying the year picker
     * @param open - should show the year picker
     * @returns void
     */
    public yearPickerDisplay(open: boolean = true): void {
        if (this.type === "month" || this.type === "year") {
            return;
        }

        this.showYearPicker = open;
        if (this.type === "date" || this.type === "datetime-local") {
            this.showMonthPicker = !open;
        }
    }

    /**
     * Handler for selected date in the calendar
     * @param date - The date clicked
     * @public
     */
    public handleDateClicked({ day, month, year }): void {
        this.setValue({ day, month, year });
    }

    /**
     * Handler for selecting a month in the month picker
     * @param month - The month clicked
     * @public
     */
    public handleMonthClicked(month: number, year: number): void {
        this.calendarMonth = month;
        this.calendarYear = year;

        if (this.type === "month") {
            this.setValue({ month, year });
        }

        if (this.type === "datetime-local") {
            this.monthPickerDispay(false);
        }
    }

    /**
     * Handler for selecting a year in the year picker
     * @param year - The year clicked
     * @public
     */
    public handleYearClicked(year: number): void {
        this.monthView = year;

        if (this.type === "year") {
            this.setValue({ year });
        } else if (this.type === "date" || this.type === "datetime-local") {
            this.yearPickerDisplay(false);
        }
    }

    /**
     * Handler for selecting an hour in the time picker
     * @param hour - The hour clicked
     * @public
     */
    public handleHourClicked(hour: number): void {
        this.setValue({ hour });
    }

    /**
     * Handler for selecting the minutes in the time picker
     * @param minute - The minute clicked
     * @public
     */
    public handleMinuteClicked(minute: number): void {
        this.setValue({ minute });
    }

    /**
     * Handler for selecting the meridian in the time picker
     * @param meridian - The meridian clicked
     * @public
     */
    public handleMeridianClicked(meridian: "AM" | "PM"): void {
        this.setValue({ meridian });
    }

    /**
     * Handler for the blur event on the text field
     * @public
     */
    public handleBlur(): void {
        if (
            this.textField &&
            this.textField.control.value &&
            this.textField.control.value !== this.value
        ) {
            let value = this.textField.control.value;
            if (this.type === "time") {
                if (value.indexOf(":") < 0) {
                    value = value.replace(/(\d)( *[a|p]?m?\D*)$/i, "$1:00$2");
                }
                value = "1/1/2000 " + value.replace(/([a|p]m)/i, " $1 ");
            } else if (this.type === "year" && value.indexOf("/") < 0) {
                value = "1/1/" + value;
            }
            const date = new Date(value);
            if (date.getTime()) {
                this.setValue(value);
            } else {
                this.textField.control.value = "";
            }
        }
    }

    /**
     * Handler for the focus event on the text field
     * @public
     */
    public handleFocus(): void {
        if (!this.allowTextInput) {
            this.textField.control.blur();
        }
    }

    /**
     * Handler for the keyup event on the text field
     * @param event - Keyboard event for key press
     */
    public handleKeyup(event: Event & KeyboardEvent) {
        const key = event.key;

        switch (key) {
            case "Escape":
                if (this.textField) {
                    this.textField.control.value = "";
                    this.textField.control.blur();
                    this.closeFlyout(true);
                }
                break;
        }
    }

    /**
     * Converst a Date or string to a date object. Defaults to todays date
     * @param date
     * @returns
     */
    private getDateAsObject(date: Date | string = new Date()): {} {
        if (typeof date === "string") {
            date = new Date(date);
        }

        if (!date.getTime()) {
            return {};
        }

        return {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            hour: date.getHours() % 12 || 12,
            minute: date.getMinutes(),
            meridian: date.getHours() > 12 ? "PM" : "AM",
        };
    }

    /**
     * Creates an object for date and time formatting based on the date-picker type
     * @returns
     * @private
     */
    private getFormatting() {
        const keyToFormat = (formatObject, key) => {
            const formatKey = `${key}Format`;
            if (this[formatKey]) {
                formatObject[key] = this[formatKey];
            }
            return formatObject;
        };
        const formatting = {
            date: ["year", "month", "day", "weekday"],
            month: ["month", "year"],
            year: ["year"],
            time: ["hour", "minute", "meridian"],
            "datetime-local": [
                "year",
                "month",
                "day",
                "weekday",
                "hour",
                "minute",
                "meridian",
            ],
        };

        return formatting[this.type].reduce(keyToFormat, {});
    }

    /**
     * Flag to prevent value setting more than once
     */
    private settingValue: boolean = false;

    /**
     * Validates and sets values
     * @param values - object containing key-values to update
     * @public
     */
    public setValue(values: {} | string | Date): void {
        if (this.settingValue || !this.type) {
            return;
        }
        this.settingValue = true;
        this.textField?.control?.blur();
        if (typeof values === "string" || values instanceof Date) {
            values = this.getDateAsObject(values);
        }
        this.selectedDate = Object.assign({}, this.selectedDate, values);

        if (this.type === "time") {
            if (
                !this.selectedDate.hour ||
                this.selectedDate.minute === undefined ||
                !this.selectedDate.meridian
            ) {
                this.settingValue = false;
                return;
            }

            this.closeFlyout(true);
        }

        this.selectedDate = Object.assign({}, this.getDateAsObject(), this.selectedDate);
        const { year, month, day, hour, minute, meridian } = this.selectedDate;
        const formatting = this.getFormatting();

        const date = new Date(
            year,
            month - 1,
            day,
            hour + (meridian === "PM" ? 12 : 0),
            minute
        );
        const dateString: string = date.getTime()
            ? this.dateFormatter.getDate(date, formatting)
            : "";

        this.value = dateString;
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.value = dateString;
        }
        if (this.textField) {
            this.textField.control.value = dateString;
        }

        this.setViews();

        if (this.type !== "datetime-local") {
            this.closeFlyout(true);
        }
        this.settingValue = false;
    }

    /**
     * Component has finished rendering
     * @public
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.proxy.setAttribute("type", "text");
        this.validate();
        this.setCalendarTitle();
        this.showCalendar = this.type.indexOf("date") >= 0;
        this.showMonthPicker = this.type === "date" || this.type === "month";
        this.showYearPicker = this.type === "month" || this.type === "year";

        window.addEventListener("click", () => this.closeFlyout());
    }

    /**
     * Component unloads
     * @public
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("click", () => this.closeFlyout());
    }
}
