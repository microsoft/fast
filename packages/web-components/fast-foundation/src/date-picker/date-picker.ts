import { attr, nullableNumberConverter } from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";

export type DatePickerOptions = FoundationElementDefinition & {};

export class DatePicker extends FoundationElement {
    /**
     * Value for the date-picker
     * @public
     */
    @attr
    public value: string;

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
    public type: string;

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
        let hours = [];
        let minutes = [];
        let meridian = "";

        return {
            hours,
            minutes,
            meridian,
        };
    }

    /**
     * Method used to get a list of months
     */
    public getMonths() {}
}
