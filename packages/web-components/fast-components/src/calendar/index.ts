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
export const fastCalendar = Calendar.compose({
    baseName: "calendar",
    template,
    styles,
});

/**
 * Styles for Calendar
 * @public
 */
export const CalendarStyles = styles;

/**
 * Custom grid component for the calendar component
 */
export const fastCalendarGrid = DataGrid.compose({
    baseName: "calendar-grid",
    template: dataGridTemplate,
});

/**
 * Custom grid row component for the calendar component
 */
export const fastCalendarGridRow = DataGridRow.compose({
    baseName: "calendar-grid-row",
    template: dataGridRowTemplate,
});

/**
 * Custom grid cell component for the calendar component
 */
export const fastCalendarGridCell = DataGridCell.compose({
    baseName: "calendar-grid-cell",
    template: dataGridCellTemplate,
});

/**
 * Base class for DataGrid
 * @public
 */
export { DataGrid };

/**
 * Base class for DataGridRow
 * @public
 */
export { DataGridRow };

/**
 * Base class for DataGridCell
 * @public
 */
export { DataGridCell };
