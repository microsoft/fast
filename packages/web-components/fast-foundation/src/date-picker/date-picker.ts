import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import { DateFormatter } from "../calendar/date-formatter";

export type DatePickerOptions = FoundationElementDefinition & {};

export class DatePicker extends FoundationElement {
    @attr
    public type: "date" | "datetime-local" | "month" | "year" | "time" = "date";

    /**
     * Value for the date-picker
     * @public
     */
    @attr
    public value: string;

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
    public allowTextInput: boolean;

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
    public meridian: "AM" | "PM";

    /**
     * The selected day
     * @public
     */
    @attr
    public day: number;

    @attr
    public date: string;

    /**
     * The selected month
     * @public
     */
    @attr
    public month: number = new Date().getMonth() + 1;

    /**
     * The selected year
     * @public
     */
    @attr
    public year: number = new Date().getFullYear();

    @observable
    public yearView: number = new Date().getFullYear();

    @observable
    public yearRangeView: number = Math.floor(new Date().getFullYear() / 10) * 10;

    /**
     * Dates that are not selectable
     * @public
     */
    @attr({ attribute: "disabled-dates" })
    public disabledDates: string;

    /**
     * Method used to return hours, minutes and meridians for the time selector
     * @returns
     *
     * @public
     */
    public getTimes() {
        const hours = new Array(12).fill(null).map((_, index) => {
            const hour = this.hour || new Date().getHours();
            let value = hour - (hour > 12 ? 12 : 0) + index;
            if (value > 12) {
                value -= 12;
            }
            return {
                text: value.toString(),
                value,
                action: () => this.handleHourClicked(value),
            };
        });
        const minutes = new Array(60).fill(null).map((_, index) => {
            const minute = this.minute ?? new Date().getMinutes();
            const value = (minute + index) % 60;
            return {
                text: `${value < 10 ? "0" : ""}${value}`,
                value,
                action: () => this.handleMinuteClicked(value),
            };
        });
        let meridians = [
            { text: "AM", action: () => this.handleMeridianClicked("AM") },
            { text: "PM", action: () => this.handleMeridianClicked("PM") },
        ];
        const meridian = this.meridian ?? new Date().getHours() >= 12 ? "PM" : "AM";
        if (meridian === "PM") {
            meridians = meridians.reverse();
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
    public arrayToMatrix(array, itemsPerRow) {
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
                action: () => this.handleMonthClicked(index + 1),
                selected: this.month === index + 1 && this.year === this.yearView,
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
            const text = this.yearRangeView + index;
            return {
                action: () => this.handleYearClicked(text),
                text,
            };
        });
    }

    public overFlyout: boolean = false;

    @observable
    public flyoutOpen: boolean = false;

    public openFlyout(force = false) {
        this.flyoutOpen = force || !!this.overFlyout;
    }

    public closeFlyout(force = false) {
        if (force || !this.overFlyout) {
            this.flyoutOpen = false;
        }
    }

    public toggleFlyout(force = false) {
        this[`${this.flyoutOpen ? "close" : "open"}Flyout`](force);
    }

    /**
     * Handler for selected date in the calendar
     * @param date - The date clicked
     */
    public handleDateClicked(date) {
        const { day, month, year } = date;
        this.day = day;
        this.month = month;
        this.year = year;

        this.date = `${month}-${day}-${year}`;

        if (this.type === "date") {
            this.value = this.dateFormatter.getDate(
                { day, month, year },
                { day: "numeric", month: "long", year: "numeric" }
            );
            this.closeFlyout(true);
        } else {
            const { hour, minute, meridian } = this;
            if (hour && minute !== undefined && meridian) {
                // Set date and time here
            }
        }
    }

    public handleMonthClicked(month) {
        this.month = month;
        this.year = this.yearView;

        if (this.type === "month") {
            this.value = this.dateFormatter.getDate(
                { day: 2, month, year: this.yearView },
                { month: "long", year: "numeric" }
            );

            this.closeFlyout(true);
        }
    }

    public handleYearClicked(year) {
        this.yearView = year;

        if (this.type === "year") {
            this.value = this.dateFormatter.getDate(
                { day: 2, month: 1, year: this.yearView },
                { year: "numeric" }
            );

            this.closeFlyout(true);
        }
    }

    public handleHourClicked(hour) {
        this.hour = hour;
        if (this.minute !== undefined && this.meridian) {
            this.value = `${this.hour}:${this.minute < 10 ? 0 : ""}${this.minute} ${
                this.meridian
            }`;

            if (this.type === "time") {
                this.closeFlyout(true);
            }
        }
    }

    public handleMinuteClicked(minute) {
        this.minute = minute;
        if (this.hour && this.meridian) {
            this.value = `${this.hour}:${this.minute < 10 ? 0 : ""}${this.minute} ${
                this.meridian
            }`;

            if (this.type === "time") {
                this.closeFlyout(true);
            }
        }
    }

    public handleMeridianClicked(meridian) {
        this.meridian = meridian;
        if (this.hour && this.minute !== undefined) {
            this.value = `${this.hour}:${this.minute < 10 ? 0 : ""}${this.minute} ${
                this.meridian
            }`;

            if (this.type === "time") {
                this.closeFlyout(true);
            }
        }
    }

    connectedCallback(): void {
        super.connectedCallback();

        window.addEventListener("click", () => this.closeFlyout());
    }
}
