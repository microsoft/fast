import {
    calendarTemplate,
    CalendarTitleTemplate,
    composedParent,
    Calendar as FoundationCalendar,
} from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch.js";
import { fillColor, neutralFillLayerRecipe } from "../design-tokens.js";
import { CalendarStyles as styles } from "./calendar.styles.js";

/**
 * The FAST Calendar class
 * @public
 */
export class Calendar extends FoundationCalendar {
    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        const parent = composedParent(this);

        if (parent) {
            fillColor.setValueFor(
                this,
                (target: HTMLElement): Swatch =>
                    neutralFillLayerRecipe
                        .getValueFor(target)
                        .evaluate(target, fillColor.getValueFor(parent)).rest
            );
        }
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
