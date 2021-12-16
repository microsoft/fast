import {
    Calendar,
    CalendarOptions,
    calendarTemplate,
    CalendarTitleTemplate,
} from "@microsoft/fast-foundation";
import { CalendarStyles as styles } from "./calendar.styles";

/**
 * The FAST Calendar Element. Implements {@link @microsoft/fast-foundation#Calendar},
 * {@link @microsoft/fast-foundation#CalendarTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: `<fast-calendar>`
 */
export const fastCalendar = Calendar.compose<CalendarOptions, typeof Calendar>({
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
