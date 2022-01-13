import { html, repeat, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import { AnchoredRegion } from "../anchored-region";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { DataGrid, DataGridCell, DataGridRow } from "../data-grid";
import { TextField } from "../text-field";
import type { DatePicker, DatePickerOptions } from "./date-picker";

/**
 * Template to render a time picker menu
 * @param listbox - tagname for a listbox
 * @param listboxOption - tagname for a listbox-option
 * @param times - labels and values for times, hours, minutes and meridian
 * @returns - A ViewTemplate
 */
export const timePickerTemplate = (context, times) => {
    return html`
        <div class="time-picker"></div>
    `;
};

export const pickerTemplate = (
    context,
    items,
    title,
    previousAction,
    nextAction,
    action
) => {
    const button = context.tagFor(Button);
    const grid = context.tagFor(DataGrid);
    const row = context.tagFor(DataGridRow);
    const cell = context.tagFor(DataGridCell);
    return html`
      <div class="picker" part="picker">
        <div class="picker-title" part="picker-title">
            <${button} class="title-action" @click="${x => title.action()}">
            ${x => title.text}
            </${button}>
            <${button} class="arrow" part="arrow-previous" @click="${x =>
        previousAction()}">
            &downarrow;
            </${button}>
            <${button} class="arrow" part="arrow-next" @click="${x => nextAction()}">
            &uparrow;
            </${button}>
        </div>
      <${grid} class="picker-grid" part="picker-grid" generate-header="none">
        ${repeat(
            x => items,
            html`
          <${row} role="row" role-type="default" class="picker-row" part="picker-row" grid-template-columns="1fr 1fr 1fr 1fr">
            ${repeat(
                x => x,
                html`
              <${cell}
                tabindex="-1"
                class="picker-cell ${x => (x.selected ? "selected" : "")}"
                part="picker-cell"
                grid-column="${(x, c) => c.index + 1}"
                @click="${x => x.action()}"
                @keydown="${(x, c) => action()}"
              >
                ${x => x.text}
              </${cell}>
            `,
                { positioning: true }
            )}
          </${row}>
        `
        )}
      </${grid}>
    </div>
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
    const calendar = context.tagFor(Calendar);

    return html`
    <template>
        <${textField} value=${x => x.value}></${textField}>
        <div class="flyout" part="flyout">
            ${x => timePickerTemplate(context, x.getTimes())}
            <${calendar} selected-dates="${x =>
        `${x.month}-${x.day}-${x.year}`}" class="calendar" @dateselected="${(x, c) =>
        x.datePicked(c.event as MouseEvent)}" part="calendar" month=${x =>
        x.month} year=${x => x.year} min-weeks="6"></${calendar}>
            ${x =>
                pickerTemplate(
                    context,
                    x.arrayToMatrix(x.getMonths(), 4),
                    { text: x.yearView, action: () => {} },
                    () => {
                        x.yearView -= 1;
                    },
                    () => {
                        x.yearView += 1;
                    },
                    () => {}
                )}
            ${x => {
                const years = x.getYears();
                const start = years[0].text;
                const end = years[years.length - 1].text;
                console.log(x.yearRangeView);
                return pickerTemplate(
                    context,
                    x.arrayToMatrix(years, 4),
                    { text: `${start} - ${end}` },
                    () => (x.yearRangeView -= 12),
                    () => (x.yearRangeView += 13),
                    () => {}
                );
            }}
        </div>
    </template>
`;
};
