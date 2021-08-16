import { html, repeat, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { DatePicker, DatePickerOptions } from "./date-picker";
import type { ElementDefinitionContext } from "../design-system";
import { TextField } from "../text-field";
import { AnchoredRegion } from "../anchored-region";
import { Listbox } from "../listbox";
import { ListboxOption } from "../listbox-option";
import { DataGrid, DataGridRow, DataGridCell } from "../data-grid";

/**
 * Template to render a time picker menu
 * @param listbox - tagname for a listbox
 * @param listboxOption - tagname for a listbox-option
 * @param times - labels and values for times, hours, minutes and meridian
 * @returns - A ViewTemplate
 */
export const timePickerTemplate: (
    listbox: string,
    listboxOption: string,
    times: any
) => ViewTemplate = (listbox: string, listboxOption: string, times: any) => {
    return html`
        <div class="time-picker"></div>
    `;
};

/**
 *
 * @param dataGrid - tagname for a data-grid
 * @param dataGridRow - tagname for a data-grid-row
 * @param dataGridCell - tagname for a data-grid-cell
 * @returns - A ViewTemplate
 */
export const monthPickerTemplate: (
    dataGrid: string,
    dataGridRow: string,
    dataGridCell: string
) => ViewTemplate = (dataGrid: string, dataGridRow: string, dataGridCell: string) => {
    return html`
        <div class="month-picker"></div>
    `;
};

/**
 *
 * @param dataGrid - tagname for a data-grid
 * @param dataGridRow - tagname for a data-grid-row
 * @param dataGridCell - tagname for a data-grid-cell
 * @returns - A ViewTemplate
 */
export const yearPickerTemplate: (
    dataGrid: string,
    dataGridRow: string,
    dataGridCell: string
) => ViewTemplate = (dataGrid: string, dataGridRow: string, dataGridCell: string) => {
    return html`
        <div class="year-picerk"></div>
    `;
};

/**
 *
 * @param context
 * @param definition
 * @returns - A ViewTemplate
 */
export const datePickerTemplate: (
    Context: ElementDefinitionContext,
    definition: DatePickerOptions
) => ViewTemplate<DatePicker> = (
    context: ElementDefinitionContext,
    definition: DatePickerOptions
) => {
    const textField = context.tagFor(TextField);
    const anchoredRegion = context.tagFor(AnchoredRegion);
    const listbox = context.tagFor(Listbox);
    const listboxOption = context.tagFor(ListboxOption);
    const dataGrid = context.tagFor(DataGrid);
    const dataGridRow = context.tagFor(DataGridRow);
    const dataGridCell = context.tagFor(DataGridCell);

    return html`
    <template>
        <${textField}></${textField}>
        <${anchoredRegion}>
            ${when(
                x => x.type === "time" || x.type === "datetime-local",
                timePickerTemplate(listbox, listboxOption, x => x.getTimes())
            )}
        </${anchoredRegion}>
    </template>
`;
};
