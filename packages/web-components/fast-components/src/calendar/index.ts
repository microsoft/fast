import {
    Calendar,
    CalendarCell,
    calendarTemplate,
    dataGridCellTemplate,
} from "@microsoft/fast-foundation";
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
 * Custom grid cell component for the calendar component
 * @public
 */
export const fastCalendarCell = CalendarCell.compose({
    baseName: "calendar-cell",
    template: dataGridCellTemplate,
});

/**
 * Base class for fastCalendar
 * @public
 */
export { Calendar };

/**
 * Base class for fastCalendarGridCell
 * @public
 */
export { CalendarCell };
