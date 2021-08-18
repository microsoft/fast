import { Calendar, calendarTemplate } from "@microsoft/fast-foundation";
import { CalendarStyles as styles } from "./calendar.styles";

/**
 * The FAST Calendar Element. Implements {@link @microsoft/fast-foundation#Calendar},
 * {@link @microsoft/fast-foundation#CalendarTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-calendar\>
 */
export const fastCalendar = Calendar.compose({
    baseName: "calendar",
    template: calendarTemplate,
    styles,
});

/**
 * Styles for Calendar
 * @public
 */
export const CalendarStyles = styles;

/**
 * Base class for fastCalendar
 * @public
 */
export { Calendar };
