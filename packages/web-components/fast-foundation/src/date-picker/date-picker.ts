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

    /**
     * The Calendar month
     * @public
     */
    @attr
    public month: number;

    /**
     * The Calendar year
     * @public
     */
    @attr
    public year: number;

    /**
     * Currently selected date
     */
    @observable
    public date: string;

    /**
     * The month of the calendar to show
     */
    @observable
    public monthView: number = new Date().getMonth() + 1;

    /**
     * The year for the month selector
     */
    @observable
    public yearView: number = new Date().getFullYear();

    /**
     * The starting year for the year selector
     */
    @observable
    public yearRangeView: number = Math.floor(new Date().getFullYear() / 10) * 10;

    /**
     * Dates that are not selectable
     * @public
     */
    @attr({ attribute: "disabled-dates" })
    public disabledDates: string;

    /**
     * Switches the calendar to the previous month
     */
    public previousCalendar(): void {
        if (this.monthView === 1) {
            this.monthView = 12;
            this.yearView -= 1;
        } else {
            this.monthView -= 1;
        }
    }

    /**
     * Switches the calendar to the next month
     */
    public nextCalendar(): void {
        if (this.monthView < 11) {
            this.monthView += 1;
        } else {
            this.monthView = 1;
            this.yearView += 1;
        }
    }

    /**
     * Resets the calendar to the current month of the current year
     */
    public resetCalendar(): void {
        const now = new Date();
        this.monthView = now.getMonth() + 1;
        this.yearView = now.getFullYear();
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
        /* Creates an array of hours data */
        const hours: { text: string; value: number; action: () => void }[] = new Array(12)
            .fill(null)
            .map((_, index) => {
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

        /* Creates an arry of minutes data */
        const minutes = new Array(60).fill(null).map((_, index) => {
            const minute = this.minute ?? new Date().getMinutes();
            const value = (minute + index) % 60;
            return {
                text: `${value < 10 ? "0" : ""}${value}`,
                value,
                action: () => this.handleMinuteClicked(value),
            };
        });

        /* An array of meridians */
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

    /**
     * Boolean to indicate if the user is interacting with the date-picker
     */
    public overFlyout: boolean = false;

    /**
     * Boolean to indicate the flyout is open
     */
    @observable
    public flyoutOpen: boolean = false;

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
    public handleMonthClicked(month: number): void {
        this.monthView = month;

        if (this.type === "month") {
            this.setValue({ month, year: this.yearView });
        }
    }

    /**
     * Handler for selecting a year in the year picker
     * @param year - The year clicked
     */
    public handleYearClicked(year: number): void {
        this.yearView = year;

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
        for (const key in values) {
            this[key] = values[key];
        }
        let { hour, minute, meridian, day, month, year, monthView, yearView } = this;
        if (this.type === "datetime-local") {
            const now = new Date();
            let hourNow = now.getHours();
            let meridianNow = "AM";
            if (hourNow > 12) {
                hourNow = hourNow - 12;
                meridianNow = "PM";
            }
            day = day || now.getDate();
            month = month || monthView;
            year = year || yearView;
            hour = values[hour] || hour || hourNow;
            minute = values[minute] ?? minute ?? new Date().getMinutes();
            meridian = values[meridian] || meridian || meridianNow;
        }
        const timeString: string =
            hour && minute !== undefined && meridian
                ? `${hour}:${minute < 10 ? "0" : ""}${minute}${meridian}`
                : "";
        const getDateString = properties => {
            let hasProperties = true;
            const formatting = {};

            for (const key in properties) {
                if (!hasProperties || this[key] === undefined) {
                    hasProperties = false;
                }
                // these should pull form local formatting
                formatting[key] =
                    key === "month"
                        ? this.type === "datetime-local"
                            ? "short"
                            : "long"
                        : "numeric";
            }
            if (!hasProperties && this.type !== "datetime-local") {
                return "";
            }
            if (!properties.day) {
                properties.day = 2;
            }
            if (!properties.month) {
                properties.month = 2;
            }

            return this.dateFormatter.getDate(properties, formatting);
        };
        let value = getDateString({ day, month, year });
        if (month && day !== undefined && year) {
            this.date = `${month}-${day}-${year}`;
        }

        switch (this.type) {
            case "month":
                value = getDateString({ month, year });
                break;
            case "year":
                value = getDateString({ year });
                break;
            case "time":
                value = timeString;
                break;
            case "datetime-local":
                value = `${timeString} ${value}`;
                break;
        }

        if (value) {
            this.value = value;

            if (this.type !== "datetime-local") {
                this.closeFlyout(true);
            }
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
