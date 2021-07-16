import { attr } from "@microsoft/fast-element";
import {
    Calendar,
    DataGrid,
    DataGridCell,
    dataGridCellTemplate,
    DataGridRow,
    dataGridRowTemplate,
    dataGridTemplate,
} from "@microsoft/fast-foundation";
import { keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";
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

export class CalendarGridCell extends DataGridCell {
    /**
     * Day of the date cell that this wraps
     * @public
     */
    @attr
    public day;

    /**
     * Month of the date cell that this wraps
     * @public
     */
    @attr
    public month;

    /**
     * Year of the date cell that this wraps
     * @public
     */
    @attr
    public year;

    /**
     *
     * @param e - keyboard event
     * Emits a date selection if the user hit either the enter or space keys
     */
    public handleKeydown(e: KeyboardEvent): void {
        if (e.keyCode === keyCodeEnter || e.keyCode === keyCodeSpace) {
            (this as any).$emit("date-select", {
                day: this.day,
                month: this.month,
                year: this.year,
            });
        }
        super.handleKeydown(e);
    }
}

/**
 * Custom grid cell component for the calendar component
 */
export const fastCalendarGridCell = CalendarGridCell.compose({
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
