import { DatePicker, datePickerTemplate } from "@microsoft/fast-foundation";
import { datePickerStyles } from "./date-picker.styles";

export const fastDatePicker = DatePicker.compose({
    baseName: "date-picker",
    template: datePickerTemplate,
    styles: datePickerStyles,
});

export { datePickerTemplate, datePickerStyles };
