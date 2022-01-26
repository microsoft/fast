import { html, ref, repeat, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import { AnchoredRegion } from "../anchored-region";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { DataGrid, DataGridCell, DataGridRow } from "../data-grid";
import { ListboxElement } from "../listbox/";
import { ListboxOption } from "../listbox-option";
import { TextField } from "../text-field";
import type { DatePicker, DatePickerOptions } from "./date-picker";

/**
 * Template to render a time picker menu
 * @param context - Control context
 * @param times - labels and values for times, hours, minutes and meridian
 * @returns - A time picker template
 * @public
 */
export const timePickerTemplate = (context: ElementDefinitionContext, times) => {
    const listbox = context.tagFor(ListboxElement);
    const listboxOption = context.tagFor(ListboxOption);
    return html`
        <div class="time-picker">
            <${listbox} class="time-list" size="7">
                ${repeat(
                    () => times.hours,
                    html`
                    <${listboxOption} @click="${x => x.action()}">${x =>
                        x.text}</${listboxOption}>
                `
                )}
            </${listbox}>
            <div class="time-separate">:</div>
            <${listbox} class="time-list" size="7">
                ${repeat(
                    () => times.minutes,
                    html`
                    <${listboxOption} @click="${x => x.action()}">${x =>
                        x.text}</${listboxOption}>
                `
                )}
            </${listbox}>
            <${listbox} class="time-list" size="7">
                ${repeat(
                    () => times.meridians,
                    html`
                    <${listboxOption} @click="${x => x.action()}">${x =>
                        x.text}</${listboxOption}>
                `
                )}
            </${listbox}>
        </div>
    `;
};

/**
 *
 * @param context - The date picker context
 * @param items  - An array of items to display
 * @param title - The picker title text
 * @param previousAction - Action to show previous options
 * @param nextAction - Action to show next options
 * @param reset - Reset views action
 * @returns - A picker template used by month and year pickers
 * @public
 */
const pickerTemplate = (context, items, title, previousAction, nextAction, reset) => {
    const button = context.tagFor(Button);
    const grid = context.tagFor(DataGrid);
    const row = context.tagFor(DataGridRow);
    const cell = context.tagFor(DataGridCell);
    return html`
      <div class="picker" part="picker">
        <div class="picker-title" part="picker-title">
            <${button} class="title-action ${x =>
        title.isInteractive ? "interactive-title" : ""}" @click="${x => title.action()}">
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
                @keydown="${(x, c) => x.action()}"
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
      ${reset}
    </div>
  `;
};

/**
 *
 * @param context - The date-picker class context
 * @param definition - Date-picker options
 * @returns - A ViewTemplate
 * @public
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
    const button = context.tagFor(Button);
    const calendar = context.tagFor(Calendar);
    const resetButton = html`<${button} class="reset-text" part="reset-text" @click="${x =>
        x.resetCalendar()}">${x => x.resetText}</${button}>`;

    return html`
    <template
        @mouseover="${x => (x.overFlyout = true)}"
        @mouseout="${x => (x.overFlyout = false)}"
    >
        <${textField}
            ${ref("textField")}
            name=${x => x.name}
            @click="${x => (!x.readonly ? x.toggleFlyout(true) : () => {})}"
            ?readonly="${x => x.readonly}"
            placeholder="${x => x.placeholder}"
            appearance="${x => x.appearance}"
            ?disabled="${x => x.disabled}"
            ?required="${x => x.required}"
            @blur="${x => x.handleBlur()}"
            @focus="${x => x.handleFocus()}"
            @keyup="${(x, c) => x.handleKeyup(c.event as KeyboardEvent)}"
        >
            <div slot="end">&#128197;</div>
        </${textField}>
        ${when(
            x => !x.readonly && !x.disabled,
            html`
            <${anchoredRegion}
                class="flyout ${x => (x.flyoutOpen ? "show" : "")}"
                part="flyout"
                :anchorElement="${x => x.textField}"
                vertical-positioning-mode="dynamic"
                vertical-default-position="bottom"
                horizontal-positioning-mode="dynamic"
                horizontal-inset="true"
                horizontal-default-position="start"
            >
                ${when(
                    x => x.type === "datetime-local" || x.type === "time",
                    html`
                        ${x => timePickerTemplate(context, x.getTimes())}
                    `
                )}
                ${when(
                    x => x.showCalendar,
                    html`
                    <${calendar}
                        selected-dates="${x => `${x.date || ""}`}"
                        class="calendar"
                        @dateselected="${(x, c) => x.handleDateClicked(c.event)}"
                        part="calendar"
                        locale="${x => x.locale}"
                        month="${x => x.calendarMonth}"
                        year="${x => x.calendarYear}"
                        min-weeks="6">
                            <div
                                slot="title"
                                class="calendar-title-wrap"
                                @click="${x => x.monthPickerDispay()}"
                                >
                                <${button} class="calendar-title ${x =>
                        x.type === "datetime-local"
                            ? "interactive-title"
                            : ""}" part="calendar-title">
                                    ${x => x.calendarTitle}
                                </${button}>
                                <div class="calendar-controls" part="calendar-controls">
                                    <${button} @click="${x =>
                        x.previousCalendar()}" class="calendar-control">&downarrow;</${button}>
                                    <${button} @click="${x =>
                        x.nextCalendar()}" class="calendar-control">&uparrow;</${button}>
                                </div>
                            </div>
                        </${calendar}>
                `
                )}
                ${when(
                    x => x.showMonthPicker,
                    x =>
                        pickerTemplate(
                            context,
                            x.arrayToMatrix(x.getMonths(), 4),
                            {
                                text: x.dateFormatter.getYear(x.monthView),
                                action: x.yearPickerDisplay.bind(x),
                                isInteractive: x.type.indexOf("date") >= 0,
                            },
                            () => {
                                x.monthView -= 1;
                            },
                            () => {
                                x.monthView += 1;
                            },
                            x.type.indexOf("date") >= 0 ? resetButton : () => {}
                        )
                )}
                ${when(
                    x => x.showYearPicker,
                    x => {
                        const years = x.getYears();
                        const start = years[0].text;
                        const end = years[years.length - 1].text;
                        return pickerTemplate(
                            context,
                            x.arrayToMatrix(years, 4),
                            {
                                text: `${start} - ${end}`,
                                action: x.yearPickerDisplay.bind(x, false),
                                isInteractive: x.type.indexOf("date") >= 0,
                            },
                            () => (x.yearView -= 12),
                            () => (x.yearView += 12),
                            x.type.indexOf("date") >= 0 ? resetButton : () => {}
                        );
                    }
                )}
            </${anchoredRegion}>
        `
        )}
    </template>
`;
};
