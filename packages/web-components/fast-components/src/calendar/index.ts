import {
    calendarTemplate,
    CalendarTitleTemplate,
    Calendar as FoundationCalendar,
} from "@microsoft/fast-foundation";
import { fillColor, neutralLayerFloating } from "../design-tokens";
import { CalendarStyles as styles } from "./calendar.styles";

/**
 * The FAST listbox class
 * @public
 */
export class Calendar extends FoundationCalendar {
    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        fillColor.setValueFor(this, neutralLayerFloating);
    }
}

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
 * Styles for Calendar
 * @public
 */
export const CalendarStyles = styles;
