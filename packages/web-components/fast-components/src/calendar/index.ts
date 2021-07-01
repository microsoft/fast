import { customElement, ViewTemplate } from "@microsoft/fast-element";
import {
    Calendar,
    DataGrid,
    DataGridCell,
    dataGridCellTemplate,
    DataGridRow,
    dataGridRowTemplate,
    dataGridTemplate,
} from "@microsoft/fast-foundation";
import { FASTCalendarTemplate as template } from "./calendar.template";
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

/**
 * Custom grid component for the calendar component
 */
export const FASTCalendardGrid = DataGrid.compose({
    baseName: "calendar-grid",
    template: dataGridTemplate,
});

/**
 * Custom grid row component for the calendar component
 */
export const FASTCalendarGridRow = DataGridRow.compose({
    baseName: "calendar-grid-row",
    template: dataGridRowTemplate,
});

/**
 * Custom grid cell component for the calendar component
 */
export const FASTCalendarGridCell = DataGridCell.compose({
    baseName: "calendar-grid-cell",
    template: dataGridCellTemplate,
});
