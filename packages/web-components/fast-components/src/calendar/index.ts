import { customElement } from "@microsoft/fast-element";
import { Calendar, CalendarTemplate as template } from "@microsoft/fast-foundation";
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
@customElement({
    name: "fast-calendar",
    template,
    styles,
})
export class FASTCalendar extends Calendar {}

/**
 * Styles for Calendar
 * @public
 */
export const CalendarStyles = styles;
