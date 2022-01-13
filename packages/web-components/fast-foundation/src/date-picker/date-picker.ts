import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import { DateFormatter } from "../calendar/date-formatter";

export type DatePickerOptions = FoundationElementDefinition & {};

export class DatePicker extends FoundationElement {
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
     * Picker type: date | month | week | time | datetime-local
     * @public
     */
    @attr
    public type: string;

    /**
     * Selected hour
     * @public
     */
    @attr
    public hour: number = new Date().getHours();

    /**
     * Selected minute
     * @public
     */
    @attr
    public minute: number = new Date().getMinutes();

    /**
     * The meridian: AM | PM
     * @public
     */
    @attr
    public meridian: string = new Date().getHours() > 12 ? "PM" : "AM";

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
            let value = this.hour - (this.hour > 12 ? 12 : 0) + index;
            if (value > 12) {
                value -= 12;
            }
            return { text: value.toString(), value };
        });
        const minutes = new Array(60).fill(null).map((_, index) => {
            const value = (this.minute + index) % 60;
            return { text: `${value < 10 ? "0" : ""}${value}`, value };
        });
        const meridian = [{ text: "AM" }, { text: "PM" }];
        if (this.meridian === "PM") {
            meridian.reverse();
        }

        return {
            hours,
            minutes,
            meridian,
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
                action: () => {
                    this.month = index + 1;
                    this.year = this.yearView;
                },
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
                action: () => (this.yearView = text),
                text,
            };
        });
    }

    /**
     * Handler for selected date in the calendar
     * @param event - The mouse event for the date clicked
     */
    public datePicked(event: MouseEvent) {
        const { day, month, year } = event.detail as any;
        this.day = day;
        this.month = month;
        this.year = year;
        this.value = this.dateFormatter.getDate(
            { day, month, year },
            { day: "numeric", month: "long", year: "numeric" }
        );
    }
}
