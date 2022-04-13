import {
    DatePicker,
    DatePickerOptions,
    datePickerTemplate as template,
} from "@microsoft/fast-foundation";
import { DatePickerStyles as styles } from "./date-picker.styles.js";

/**
 * The FAST Date-picker Element.
 *
 * @alpha
 * @remarks
 * HTML Element: `<fast-date-picker>`
 */
export const fastDatePicker = DatePicker.compose({
    baseName: "date-picker",
    template,
    styles,
    calendarIcon: "&#128197;",
    previousIcon: "&downarrow;",
    nextIcon: "&uparrow;",
} as DatePickerOptions);

/**
 * Exporting component elements
 * @alpha
 */
export { DatePicker, styles as DatePickerStyles, DatePickerOptions };
