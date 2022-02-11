import {
    DatePicker,
    DatePickerOptions,
    datePickerTemplate as template,
} from "@microsoft/fast-foundation";
import { DatePickerStyles as styles } from "./date-picker.styles";

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
 * Base class for fastDatePicker
 * @alpha
 */
export { DatePicker };

/**
 * Date picker styles
 * @public
 */
export { styles as DatePickerStyles };
