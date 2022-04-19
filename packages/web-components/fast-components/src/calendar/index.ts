import {
    Calendar,
    calendarTemplate,
    CalendarTitleTemplate,
} from "@microsoft/fast-foundation";
import { CalendarStyles as styles } from "./calendar.styles.js";

/**
 * The FAST Calendar Element. Implements {@link @microsoft/fast-foundation#Calendar},
 * {@link @microsoft/fast-foundation#CalendarTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: `<fast-calendar>`
 */
export const fastCalendar = Calendar.compose({
    baseName: "calendar",
    template: calendarTemplate,
    styles,
    title: CalendarTitleTemplate,
});

/**
 * Base class for fastCalendar
 * @public
 */
export { Calendar };

export { styles as CalendarStyles };
