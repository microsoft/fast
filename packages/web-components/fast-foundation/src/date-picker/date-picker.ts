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
     * Value for the date-picker
     * @public
     */
    @attr
    public value: string;
    public valueChanged(previous, next) {
        if (this.value) {
            let value = "";
            const formatter: DateFormatter = this.getFormatter(
                "weekdayFormat",
                "dayFormat",
                "monthFormat",
                "yearFormat"
            );
            switch (this.type) {
                case "time":
                    value = formatter.getTime(this.value);
                    break;
                case "month":
                    const monthStrs = this.value.split(/[/-]/);
                    this.month = parseInt(monthStrs[0]);
                    this.year = parseInt(monthStrs[1]);
                    formatter.monthFormat = "long";
                    value = `${formatter.getMonth(
                        parseInt(this.value)
                    )} ${formatter.getYear(this.year)}`;
                    break;
                case "year":
                    this.year = parseInt(this.value);
                    value = formatter.getYear(parseInt(this.value));
                    break;
                default:
                    const dateStrs = this.value.split(/[/-]/);
                    this.day = parseInt(dateStrs[1]);
                    this.month = parseInt(dateStrs[0]);
                    this.year = parseInt(dateStrs[2]);
                    this.selectedDate = this.value;
                    value = formatter.getDate(this.value);
                    break;
            }
            if (this.control) {
                this.control.value = value;
            }
        }
    }

    /**
     * Text input field for the date
     * @internal
     */
    public control: HTMLInputElement;

    /**
     * Locale information including market(language and country), calendar type and numbering system
     * @public
     */
    @attr
    public locale: string;

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
    public allowTextInput: boolean;

    /**
     * Picker type: date | month | week | time | datetime-local
     * @public
     */
    @attr
    public type: string = "date";

    /**
     * Selected hour
     * @public
     */
    @attr
    public hour: number;

    /**
     * Selected minute
     * @public
     */
    @attr
    public minute: number;

    /**
     * The meridian: AM | PM
     * @public
     */
    @attr
    public meridian: string;

    /**
     * The selected day
     * @public
     */
    @attr
    public day: number;

    /**
     * The selected month
     * @public
     */
    @attr
    public month: number;

    /**
     * The selected year
     * @public
     */
    @attr
    public year: number;

    @attr({ attribute: "day-format", mode: "fromView" })
    public dayFormat: DayFormat = "numeric";

    @attr({ attribute: "weekday-format", mode: "fromView" })
    public weekdayFormat: WeekdayFormat;

    @attr({ attribute: "month-format", mode: "fromView" })
    public monthFormat: MonthFormat = "numeric";

    @attr({ attribute: "year-format", mode: "fromView" })
    public yearFormat: YearFormat = "numeric";

    @observable
    public selectedDate: string;

    @observable
    public inputfield;

    /**
     * Month used to render calendar, month, and year pickers
     * @public
     */
    @observable
    public monthView: number = new Date().getMonth() + 1;

    /**
     * Year used to render calendar, month, and year pickers
     */
    @observable
    public yearView: number = new Date().getFullYear();

    @observable
    public yearsView: number = Math.floor(new Date().getFullYear() / 10) * 10;

    /**
     * Dates that are not selectable
     * @public
     */
    @attr({ attribute: "disabled-dates" })
    public disabledDates: string;

    /**
     * State of the flyout menu
     * @public
     */
    @observable
    public menuOpen: boolean = false;

    /**
     * Whether the user is interacting with the menu
     * @public
     */
    @observable
    public overMenu: boolean = false;

    @observable
    public calendarMonth: number;

    @observable
    public calendarYear: number;

    /**
     * Object containing a list of hours, minutes, and meridians used for rendering a time selector
     * @public
     */
    @observable
    public times: {
        hours: number[];
        minutes: number[];
        meridian: string[];
    };

    public connectedCallback() {
        super.connectedCallback();

        if (this.value) {
            this.valueChanged(this.value, this.value);
        }
        window.addEventListener("click", () => this.closeMenu());
    }

    /**
     * Method used to return hours, minutes and meridians for the time selector
     * @returns
     *
     * @internal
     */
    public getTimes() {
        const now = new Date();
        const hours = new Array(12).fill(null).map((_, index) => {
            const value = ((this.hour ?? now.getHours()) + index) % 12 || 12;

            return {
                value,
                text: value,
            };
        });
        const minutes = new Array(60).fill(null).map((_, index) => {
            const minute = ((this.minute ?? now.getMinutes()) + index) % 60;
            const value = `${minute < 10 ? "0" : ""}${minute}`;

            return {
                value,
                text: value,
            };
        });
        const meridians = (this.meridian !== "AM" && now.getHours() >= 12
            ? ["PM", "AM"]
            : ["AM", "PM"]
        ).map(value => ({
            value,
            text: value,
        }));

        return {
            hours,
            minutes,
            meridians,
        };
    }

    /**
     * Method used to open the flyout menu
     * @internal
     */
    public openMenu(force: boolean = false) {
        if (!this.menuOpen && (this.overMenu || force)) {
            this.menuOpen = true;
        }
    }

    /**
     * Method used to close the flyout menu
     * @internal
     */
    public closeMenu(force: boolean = false) {
        if (this.menuOpen && (!this.overMenu || force)) {
            this.menuOpen = false;
        }
    }

    /**
     * Method to open the menu if closed otherwise, close the menu
     * @internal
     */
    public toggleMenu(force: boolean = false, e?: Event) {
        e?.stopPropagation();
        if (this.menuOpen) {
            this.closeMenu(force);
        } else {
            this.openMenu(force);
        }
    }

    /**
     * Handles closing the menu if it's not being interacted with
     *
     * @internal
     */
    handleClick() {
        if (!this.overMenu) {
            this.closeMenu();
        }
    }

    /**
     * Handles selecting a date on the calendar
     * @param event - The mouse click event
     * @internal
     */
    handleDateSelect(event: CustomEvent) {
        const { day, month, year } = event.detail;
        this.value = `${month}-${day}-${year}`;
        this.closeMenu(true);
    }

    /**
     * Handles selecting a month
     * @param month - month selected
     * @internal
     */
    handleMonthSelect(month) {
        if (this.type === "month") {
            this.value = `${month}-${this.yearView}`;
            this.closeMenu(true);
        } else {
            this.month = month;
            this.year = this.yearView;
        }
    }

    /**
     * Handles selecting a year
     * @param year - year selected
     * @internal
     */
    handleYearSelect(year) {
        if (this.type === "year") {
            this.year = year;
            this.value = year;
            this.closeMenu(true);
        } else {
            this.year = year;
            this.yearView = year;
        }
    }

    /**
     * Handles selecting an hour
     * @param hour - hour selected
     * @internal
     */
    handleHourSelect(hour) {
        this.hour = hour;
        if (this.minute !== undefined && this.meridian) {
            this.closeMenu(true);
            this.value = `${hour}:${this.minute} ${this.meridian}`;
        }
    }

    /**
     * Handles selecting minutes
     * @param minute - minute selected
     * @internal
     */
    handleMinuteSelect(minute) {
        this.minute = minute;
        if (this.hour && this.meridian) {
            this.closeMenu(true);
            this.value = `${this.hour}:${minute} ${this.meridian}`;
        }
    }

    /**
     * Handles selecting meridian
     * @internal
     */
    public handleMeridianSelect(meridian) {
        this.meridian;
        if (this.hour && this.minute !== undefined) {
            this.closeMenu(true);
            this.value = `${this.hour}:${this.minute} ${meridian}`;
        }
    }

    /**
     * Handles leaving the input fields focus
     */
    public handleBlur() {
        if (this.control && this.control.value) {
            const date = new Date(this.control.value);
            console.log(date);
            this.value = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
        }
    }

    /**
     * Creates a formatter for getting localized strings
     * @param options - Options for formatting
     * @returns - a string formatter
     * @internal
     */
    public getFormatter(...options) {
        const formatter = new DateFormatter();
        formatter.locale = this.locale;
        options.forEach(key => (formatter[key] = this[key]));
        return formatter;
    }

    /**
     *  Creates of matrix of month names or years for month and year pickers
     * @param type - The type of items to get, month or year
     * @param start - Starting index
     * @param locale - Localization information
     * @param format - formatting of labels
     * @returns - returns a matrix of either months or years
     * @internal
     */
    public getMatrix(type: "month" | "year" = "month") {
        const settings = {
            month: {
                start: 1,
                format: "short",
                action: this.handleMonthSelect,
            },
            year: {
                start: this.yearsView,
                format: "numeric",
                action: this.handleYearSelect,
            },
        };

        const values = new Array(12).fill(null).reduce((matrix, _, index) => {
            if (index % 4 === 0) {
                matrix.push([]);
            }

            const value = settings[type].start + index;
            const options = {};
            options[type] = settings[type].format;
            const text = new Intl.DateTimeFormat(this.locale, options).format(
                new Date(
                    `${type === "month" ? value : 2}-2-${type === "year" ? value : 2020}`
                )
            );
            const last = matrix[matrix.length - 1];
            const selected =
                this[type] === value && (type === "year" || this.year === this.yearView);
            const action = settings[type].action.bind(this, value);

            last.push({
                value,
                text,
                action,
                selected,
            });

            return matrix;
        }, []);

        return values;
    }
}
