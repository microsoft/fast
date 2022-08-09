import {
    attr,
    booleanConverter,
    DOM,
    observable,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnter,
    keyEscape,
    keySpace,
} from "@microsoft/fast-web-utilities";
import type {
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "../foundation-element/foundation-element.js";
import type { ListboxElement } from "../listbox/listbox.element.js";
import {
    DateFormatter,
    DayFormat,
    MonthFormat,
    WeekdayFormat,
    YearFormat,
} from "../calendar/date-formatter.js";
import type { TextField } from "../text-field/text-field.js";
import { FormAssociatedDatePicker } from "./date-picker.form-associated.js";

/**
 * Date picker options
 * @alpha
 */
export type DatePickerOptions = FoundationElementDefinition & {
    calendarIcon?:
        | FoundationElementTemplate<
              SyntheticViewTemplate<any, DatePicker>,
              DatePickerOptions
          >
        | SyntheticViewTemplate
        | string;
    previousIcon?:
        | FoundationElementTemplate<
              SyntheticViewTemplate<any, DatePicker>,
              DatePickerOptions
          >
        | SyntheticViewTemplate
        | string;
    nextIcon?:
        | FoundationElementTemplate<
              SyntheticViewTemplate<any, DatePicker>,
              DatePickerOptions
          >
        | SyntheticViewTemplate
        | string;
};

/**
 * Struct for holding parsed data from a specific Date
 * @public
 */
export type DateData = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    seconds?: number;
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

    /**
     * Ensures that the value is valid for the updated type
     * @param previous - previous type
     * @param next - updated type
     * @public
     */
    public typeChanged(previous: string, next: string): void {
        if (next && this.value) {
            this.valueChanged("", this.value);
        }
    }

    /**
     * Value for the date-picker
     * @public
     */
    @attr
    public value: string;

    /**
     * Validates that the value is a valid date
     * @param previous - the previous selected value
     * @param next - the updated selected value
     * @publc
     */
    public valueChanged(previous: string, next: string): void {
        super.valueChanged(previous, next);
        if (previous !== next) {
            if (!previous) {
                this.setValue(next);
            }
            this.$emit("change");
            this.$emit("input");
        }
    }

    /**
     * Text used for resetting the views back to todays date
     * @public
     */
    @attr({ attribute: "reset-text" })
    public resetText: string;

    /**
     * date formatter utitlity for getting localized strings
     * @internal
     */
    private dateFormatter: DateFormatter = new DateFormatter();

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
    @attr
    public min: string;

    /**
     * Maximum allowed date
     * @public
     */
    @attr
    public max: string;

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
     * Whether there should time output should be 24hour formatted
     * @public
     */
    @attr({ attribute: "hour-12", converter: booleanConverter })
    public hour12: boolean = true;

    /**
     * Selected date object
     * @public
     */
    @observable
    private selectedDate: DateData;

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
     * @internal
     */
    @observable
    private textField: TextField;

    /**
     * Adds the value to the textfield when it's attached to the dom
     * @param previous - previous textfield element
     * @param next - updated textfield
     * @public
     */
    public textFieldChanged(previous: TextField, next: TextField) {
        // Once the textfield is loaded, format its value
        if (!previous && !!next && this.value) {
            this.textField.value = this.value;
        }
    }

    /**
     * The hour select listbox
     * @public
     */
    public hourSelect: ListboxElement;

    /**
     * The minute select listbox
     * @public
     */
    public minuteSelect: ListboxElement;

    /**
     * The meridian select listbox
     * @public
     */
    public meridianSelect: ListboxElement;

    /**
     * The Calendar month
     * @public
     */
    @observable
    public calendarMonth: number = new Date().getMonth() + 1;

    /**
     * Handles changing the calendar view month
     * @param previous - the current month value
     * @param next - the next month value
     * @public
     */
    public calendarMonthChanged(previous: number, next: number) {
        this.setCalendarTitle();
    }

    /**
     * The Calendar year
     * @public
     */
    @observable
    public calendarYear: number = new Date().getFullYear();

    /**
     * Handles changing the calendar view year
     * @param previous - the current calendar year view
     * @param next - the next calendar year view
     * @public
     */
    public calendarYearChanged(previous: number, next: number) {
        this.setCalendarTitle();
    }

    /**
     * Sets the calendar title text
     * @public
     */
    public setCalendarTitle() {
        if (this.calendarMonth && this.calendarYear) {
            this.calendarTitle = this.dateFormatter.getDate(
                `${this.calendarMonth}/1/${this.calendarYear}`,
                { month: "long", year: "numeric" }
            );
        }
    }

    /**
     * The title text for the calendar
     */
    @observable
    public calendarTitle: string = "";

    /**
     * Keyboard handler for the calendar title
     * @param e - Keyboard event fired
     * @returns should bubble
     * @public
     */
    public handleCalendarTitleKeydown(e: KeyboardEvent): boolean {
        const key: string = e.key;

        switch (key) {
            case keyEnter:
                this.monthPickerDisplay();
                return false;
            case keyArrowDown:
            case keyArrowUp:
                return this.handleCalendarChange(1, e);
        }

        return true;
    }

    /**
     * Handler for the calendar change buttons
     * @param direction - previous or next calendar
     * @param e - the keyboard event
     * @returns should bubble
     * @public
     */
    public handleCalendarChange(
        direction: number = 1,
        e?: KeyboardEvent | MouseEvent | undefined
    ): boolean {
        if (e && e instanceof KeyboardEvent) {
            const key: string = e.key;

            switch (key) {
                case keyEnter:
                case keySpace:
                    this.calendarChange(direction);
                    return false;
                case keyArrowDown:
                    this.calendarChange(-1);
                    return false;
                case keyArrowUp:
                    this.calendarChange(1);
                    return false;
            }
        } else {
            this.calendarChange(direction);
            return false;
        }

        return true;
    }

    public calendarChange(direction: number = 1) {
        this.calendarMonth = (this.calendarMonth + direction) % 12 || 12;
        this.calendarYear +=
            this.calendarMonth - direction < 1 || this.calendarMonth - direction > 12
                ? direction
                : 0;
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
            const now = new Date();
            const {
                year = now.getFullYear(),
                month = now.getMonth() + 1,
                day = now.getDate(),
            } = this.selectedDate;
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
        const date: (hour: number, minute: number) => Date = (
            hour: number,
            minute: number
        ) => new Date(2000, 1, 1, hour, minute);
        /* Creates an array of hours data */
        const hours: { text: string; value: number; action: () => void }[] = new Array(12)
            .fill(null)
            .map((_, index) => {
                const hour: number = this.selectedDate?.hour || new Date().getHours();
                let value: number = hour - (hour > 12 ? 12 : 0) + index;
                if (value > 12) {
                    value -= 12;
                }
                const hourDate: Date = date(value, 1);
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
                const minuteDate: Date = date(1, value);
                const parts = (partFormatter as any).formatToParts(minuteDate);
                const minutePart = parts.find(
                    (part: { type: string; value: string }) => part.type === "minute"
                );
                const text: string = minutePart.value;

                return {
                    text,
                    value,
                    action: () => this.handleMinuteClicked(value),
                };
            });

        const getDayPeriod = (hour: number) => {
            const parts = (partFormatter as any).formatToParts(date(hour, 0));
            const part = parts.find(
                (part: { type: string; value: string }) => part.type === "dayPeriod"
            );
            return part.value;
        };
        const amText: string = getDayPeriod(1);
        const pmText: string = getDayPeriod(13);

        /* An array of meridians */
        const meridians: { text: string; action: () => void }[] = [
            {
                text: amText,
                action: this.handleMeridianClicked.bind(this, "AM"),
            },
            {
                text: pmText,
                action: this.handleMeridianClicked.bind(this, "PM"),
            },
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
                keyup: this.handleMonthKeyup.bind(this, index + 1, this.monthView),
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
                keyup: this.handleYearKeyup.bind(this, year),
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
     * Handles opening and closing of the picker flyout
     * @param previous - current state of the flyout
     * @param next - flyout state to update to
     * @public
     */
    public flyoutOpenChanged(previous: boolean, next: boolean) {
        window[`${next ? "add" : "remove"}EventListener`]("click", () =>
            this.closeFlyout()
        );
    }

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

    public handleFlyoutKeydown(e: KeyboardEvent): boolean {
        if (e && e.key && e.key === keyEscape) {
            e.preventDefault();
            this.closeFlyout();
            this.textField.control.focus();
            return false;
        }

        return true;
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
    public monthPickerDisplay(open: boolean = true): void {
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
    public yearPickerDisplay(open: boolean = true, e?: KeyboardEvent): boolean {
        if (!e || e.key === keyEnter) {
            if (this.type === "month" || this.type === "year") {
                return true;
            }

            this.showYearPicker = open;
            if (this.type === "date" || this.type === "datetime-local") {
                this.showMonthPicker = !open;
            }

            return false;
        }

        return true;
    }

    /**
     * Handler for selected date in the calendar
     * @param date - The date clicked
     * @public
     */
    public handleDateClicked(event: MouseEvent): void {
        const { day, month, year } = event.detail as any;
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
            this.monthPickerDisplay(false);
        }
    }

    /**
     * Handler for keyboard actions for a month
     * @param event - keyboard event
     * @returns true
     */
    public handleMonthKeyup(month: number, year: number, event: KeyboardEvent): boolean {
        switch (event.key) {
            case "Enter":
                this.handleMonthClicked(month, year);
        }

        return true;
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
     * Handler for keyboard actions for a year
     * @param event - keyboard event
     * @returns true
     */
    public handleYearKeyup(year: number, event: KeyboardEvent): boolean {
        switch (event.key) {
            case "Enter":
                this.handleYearClicked(year);
        }
        return true;
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
     * Updates the time based on the select values
     * @param keys - time keys to be updated
     * @public
     */
    public setTime(keys: string | string[] = ["hour", "minute", "meridian"]): void {
        const setKeyValues = (values: {}, key: string): {} => {
            const select = this[`${key}Select`];
            if (select) {
                const options = select.selectedOptions;
                if (options && options.length >= 1) {
                    let text = options[0].innerText;
                    text = key === "meridian" ? text : parseInt(text);
                    if (text) {
                        values[key] = text;
                    }
                }
            }

            return values;
        };

        this.setValue((!Array.isArray(keys) ? [keys] : keys).reduce(setKeyValues, {}));
    }

    /**
     * Handles keyboard events for time entry
     * @param unit - unit of time being updated
     * @param e - Keyboard event that was fired
     * @returns - should bubble
     * @public
     */
    public handleTimeKeydown(unit: string, event: KeyboardEvent): boolean {
        const key: string = event.key;
        const move: (direction?: number) => boolean = (direction = 1) => {
            event.preventDefault();
            const units: string[] = ["hour", "minute", "meridian"];
            const nextIndex: number = units.findIndex(time => time === unit) + direction;
            const unitKey: string =
                units[
                    nextIndex === units.length
                        ? 0
                        : nextIndex < 0
                        ? units.length - 1
                        : nextIndex
                ];
            const selectKey: string = `${unitKey}Select`;
            if (this[selectKey]) {
                this[selectKey].focus();
            }
            return true;
        };

        switch (key) {
            case keyEnter:
                this.setTime();
                break;
            case keySpace:
                event.preventDefault();
                this.setTime(unit);
                DOM.nextUpdate().then(move.bind(this, 1));
                return false;
            case keyArrowLeft:
                return move(-1);
            case keyArrowRight:
                return move();
            case keyEscape:
                this.closeFlyout(true);
                break;
        }

        return true;
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
            let value: string = this.textField.control.value;
            if (this.type === "time") {
                if (value.indexOf(":") < 0) {
                    value = value.replace(/(\d)( *[a|p]?m?\D*)$/i, "$1:00$2");
                }
                value = "1/1/2000 " + value.replace(/([a|p]m)/i, " $1 ");
            } else if (this.type === "year" && value.indexOf("/") < 0) {
                value = "1/1/" + value;
            }
            const date: Date = new Date(value);
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
     * Handler for when the control loses focus
     * @param event Mouse or keyboard event
     */
    public handleFocusOut(event: Event): void {
        if ((event as any).relatedTarget && (event as any).relatedTarget !== this) {
            this.closeFlyout(true);
        }
    }

    /**
     * Handler for the keyup event on the text field
     * @param event - Keyboard event for key press
     * @public
     */
    public handleKeyup(event: KeyboardEvent): boolean {
        const key = event.key;

        switch (key) {
            case keyEscape:
                if (this.textField) {
                    this.textField.control.value = "";
                    if (this.flyoutOpen) {
                        this.closeFlyout(true);
                    } else {
                        this.textField.control.blur();
                    }
                }
                break;
            case keyEnter:
                this.openFlyout(true);
                break;
        }

        return true;
    }

    /**
     * Handles chaning the calendar month view
     * @param direction - previous or next month
     * @param event - keyboard or mouse event triggered
     * @returns should bubble
     * @public
     */
    public handleMonthChange(
        direction: number = 0,
        event: KeyboardEvent | MouseEvent | undefined
    ): boolean {
        if (event instanceof KeyboardEvent) {
            const { key, currentTarget } = event;
            const updateMonth = (value: number): boolean => {
                event.preventDefault();
                this.monthView += value;
                return false;
            };

            switch (key) {
                case keyEnter:
                case keySpace:
                    return updateMonth(direction);
                case keyArrowDown:
                    return updateMonth(-1);
                case keyArrowUp:
                    return updateMonth(1);
            }
        } else {
            this.monthView += direction;
        }

        return true;
    }

    public handleYearsChange(
        direction: number = 0,
        event: KeyboardEvent | MouseEvent | undefined
    ): boolean {
        const updateYears = (dir = direction) => {
            if (event) {
                event.preventDefault();
            }
            this.yearView += 12 * dir;
            return false;
        };
        if (event instanceof KeyboardEvent) {
            const { key } = event;

            switch (key) {
                case keyEnter:
                case keySpace:
                    return updateYears(direction);
                case keyArrowDown:
                    return updateYears(-1);
                case keyArrowUp:
                    return updateYears(1);
            }
        } else {
            updateYears();
        }

        return true;
    }

    /**
     * Converst a Date or string to a date object. Defaults to todays date
     * @param date - a Date object or string, defaults to the current date
     * @returns an object representing the date
     */
    private getDateAsObject(
        date: Date | string = new Date()
    ): {
        day?: number;
        month?: number;
        year?: number;
        hour?: number;
        minute?: number;
        meridian?: "AM" | "PM";
    } {
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
     * @returns date formatting
     */
    private getFormatting() {
        const keyToFormat = (formatObject: {}, key: string) => {
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

        const selectedDate = Object.assign({}, this.getDateAsObject(), this.selectedDate);
        const now = new Date();
        const {
            year = now.getFullYear(),
            month = now.getMonth(),
            day,
            hour = now.getHours(),
            minute,
            meridian,
        } = selectedDate;
        const formatting = this.getFormatting();

        let date = new Date(
            year,
            month - 1,
            day,
            hour + (meridian === "PM" ? 12 : 0),
            minute
        );

        const start = new Date(this.min);
        const end = new Date(this.max);
        if (date.getTime() < start.getTime()) {
            date = start;
        } else if (date.getTime() > end.getTime()) {
            date = end;
        }

        this.selectedDate = this.getDateAsObject(date);

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
        if (!this.resetText) {
            this.resetText = this.dateFormatter.getDate(new Date(), this.getFormatting());
        }
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
