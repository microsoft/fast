import { attr } from "@microsoft/fast-element";
import { keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";
import { DataGridCell } from "../data-grid/data-grid-cell";

/**
 * Basic calendar cell used by the calendar grid
 * @public
 */
export class CalendarCell extends DataGridCell {
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
     * Emits a date selection if the user hit either the enter or space keys
     * @param e - keyboard event
     * @public
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
