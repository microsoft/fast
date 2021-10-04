import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
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

    /**
     * Method used to return hours, minutes and meridians for the time selector
     * @returns
     *
     * @public
     */
    public getTimes() {
        const now = new Date();
        const hours = new Array(12).fill(null).map((_, index) => {
            const value = ((this.hour ?? now.getHours()) + index) % 12 || 12;

            return {
                value,
                text: value,
                action: () => (this.hour = value),
            };
        });
        const minutes = new Array(60).fill(null).map((_, index) => {
            const value = ((this.minute ?? now.getMinutes()) + index) % 60;

            return {
                value,
                text: `${value < 10 ? "0" : ""}${value}`,
                action: () => (this.minute = value),
            };
        });
        const meridians = (this.meridian !== "AM" && now.getHours() >= 12
            ? ["PM", "AM"]
            : ["AM", "PM"]
        ).map(value => ({
            value,
            text: value,
            action: () => {
                this.meridian = value;
            },
        }));

        return {
            hours,
            minutes,
            meridians,
        };
    }

    /**
     * Method used to open the flyout menu
     * @public
     */
    public openMenu() {
        this.overMenu = true;
        this.menuOpen = true;
    }

    /**
     * Method used to close the flyout menu
     * @public
     */
    public closeMenu() {
        this.menuOpen = false;
        this.overMenu = false;
    }

    /**
     * Method to open the menu if closed otherwise, close the menu
     * @public
     */
    public toggleMenu() {
        this[this.menuOpen ? "closeMenu" : "openMenu"]();
    }

    /**
     * Handles closing the menu if it's not being interacted with
     */
    handleClick() {
        if (!this.overMenu) {
            this.closeMenu();
        }
    }

    /**
     *  Creates of matrix of month names or years for month and year pickers
     * @param type - The type of items to get, month or year
     * @param start - Starting index
     * @param locale - Localization information
     * @param format - formatting of labels
     * @returns
     */
    public getMatrix(
        type: "month" | "year" = "month",
        start: number = 1,
        locale: string = this.locale || "en-US",
        format: string = "short"
    ) {
        start = type === "month" ? 1 : this.yearsView;
        format = type === "month" ? "short" : "numeric";

        const values = new Array(12).fill(null).reduce(
            (matrix, _, index) => {
                const value = start + index;
                const options = {};
                options[type] = format;
                const text = new Intl.DateTimeFormat(locale, options).format(
                    new Date(
                        `${type === "month" ? value : 2}-2-${
                            type === "year" ? value : 2020
                        }`
                    )
                );
                const last = matrix[matrix.length - 1];
                const action =
                    type === "month"
                        ? () => {
                              this.monthView = value;
                          }
                        : () => {
                              this.yearView = value;
                          };

                last.push({
                    value,
                    text,
                    action,
                    selected: this[type] === value,
                });

                if (last.length % 4 === 0) {
                    matrix.push([]);
                }

                return matrix;
            },
            [[]]
        );

        return values;
    }
}
