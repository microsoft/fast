import { customElement, ViewTemplate } from "@microsoft/fast-element";
import {
    Calendar,
    createDataGridCellTemplate,
    createDataGridRowTemplate,
    createDataGridTemplate,
    DataGrid,
    DataGridCell,
    DataGridRow,
} from "@microsoft/fast-foundation";
import { FASTCalendarTemplate as template } from "./calendar.template";
import { CalendarStyles as styles } from "./calendar.styles";

const gridTemplate: ViewTemplate = createDataGridTemplate("fast");
const rowTemplate: ViewTemplate = createDataGridRowTemplate("fast");
const cellTemplate: ViewTemplate = createDataGridCellTemplate("fast");

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
@customElement({
    name: "fast-calendar-grid",
    template: gridTemplate,
})
export class FASTCalendardGrid extends DataGrid {}

/**
 * Custom grid row component for the calendar component
 */
@customElement({
    name: "fast-calendar-grid-row",
    template: rowTemplate,
})
export class FASTCalendarGridRow extends DataGridRow {}

/**
 * Custom grid cell component for the calendar component
 */
@customElement({
    name: "fast-calendar-grid-cell",
    template: cellTemplate,
})
export class FASTCalendarGridCell extends DataGridCell {}
