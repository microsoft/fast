import { html } from "@microsoft/fast-element";
import { DatePicker, datePickerTemplate as template } from "@microsoft/fast-foundation";
import { datePickerStyles as styles } from "./date-picker.styles";

export const fastDatePicker = DatePicker.compose({
    baseName: "date-picker",
    baseClass: DatePicker,
    template,
    styles,
});
