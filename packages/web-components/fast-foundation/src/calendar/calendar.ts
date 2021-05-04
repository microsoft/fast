import { attr, FASTElement, observable } from "@microsoft/fast-element";

export type DateStyle = "full" | "long" | "medium" | "narrow" | "short";

export type CalendarType =
    | "buddhist"
    | "chinese"
    | "coptic"
    | "ethiopia"
    | "ethiopic"
    | "gregory"
    | "hebrew"
    | "indian"
    | "islamic"
    | "iso8601"
    | " japanese"
    | "persian"
    | "roc";

export type NumberingSystem =
    | "arab"
    | "arabext"
    | "bali"
    | "beng"
    | "deva"
    | "fullwide"
    | "gujr"
    | "guru"
    | "hanidec"
    | "khmr"
    | "knda"
    | "laoo"
    | "latn"
    | "limb"
    | "mlym"
    | "mong"
    | "mymr"
    | "orya"
    | "tamldec"
    | "telu"
    | "thai"
    | "tibt";

export class Calendar extends FASTElement {
    /**
     * Month to display
     * @public
     */
    @observable
    public month: number;

    /**
     * Year of the month to display
     * @public
     */
    @observable
    public year: number;

    /**
     * Language code
     * @public
     */
    @observable
    public market: string = "en-US";

    /**
     * Calendar to use
     * @public
     */
    @observable
    public calendar: CalendarType;

    /**
     * Numbering system to use
     * @public
     */
    public numbering: NumberingSystem;

    /**
     * Format style for the week day labels
     */
    @observable
    public weekdayFormat: DateStyle;

    /**
     * Format style for the month label
     */
    @observable
    public monthFormat: DateStyle;

    /**
     * The number of miliseconds in a day
     * @internal
     */
    private oneDayInMS: number = 86400000;

    /**
     * Today's date
     * @internal
     */
    private today: Date = new Date();

    /**
     * An evaluation of whether or not the calendar is rendered as RTL
     * @internal
     */
    private isRTL: boolean;

    /**
     * String repesentation of the full locale including market, calendar type and numbering system
     * @internal
     */
    private locale: string;
}
