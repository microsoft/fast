import { html, ref, repeat, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type {
    FoundationElementTemplate,
    OverrideFoundationElementDefinition,
} from "../foundation-element";
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
 *  Generic template for handling a time element selection
 * @param context - Control context
 * @param values - List of objects of possible values
 * @param keydownHandler - keyboard handler
 * @param type - type of time select
 * @returns template
 */
const timeElementSelect = (
    context: ElementDefinitionContext,
    keydownHandler: (type: string, event: Event) => {},
    values: {}[],
    type: string
) => {
    const listbox = context.tagFor(ListboxElement);
    const listboxOption = context.tagFor(ListboxOption);

    return html`
            <${listbox}
                class="time-list"
                ${ref(`${type}Select`)}
                size="7"
                @keydown="${(x, c) => keydownHandler(type, c.event)}"
            >
                ${repeat(
                    () => values,
                    html`
                        <${listboxOption} @click="${x => x.action()}">
                            ${x => x.text}
                        </${listboxOption}>
                    `
                )}
            </${listbox}>
`;
};

/**
 * Template to render a time picker menu
 * @param context - Control context
 * @param times - labels and values for times, hours, minutes and meridian
 * @returns - A time picker template
 * @public
 */
export const timePickerTemplate = (
    context: ElementDefinitionContext,
    times,
    timeKeydown
) => {
    const timeSelectTemplate = timeElementSelect.bind(this, context, timeKeydown);
    return html`
        <div class="time-picker">
            ${x => timeSelectTemplate(times.hours, "hour")}
            <div class="time-separate">:</div>
            ${x => timeSelectTemplate(times.minutes, "minute")}
            ${x => timeSelectTemplate(times.meridians, "meridian")}
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
const pickerTemplate = (
    context,
    definition,
    items,
    title,
    previousAction,
    nextAction,
    reset
) => {
    const button = context.tagFor(Button);
    const grid = context.tagFor(DataGrid);
    const row = context.tagFor(DataGridRow);
    const cell = context.tagFor(DataGridCell);
    return html`
      <div class="picker" part="picker">
        <div class="picker-title" part="picker-title">
            <${button}
                class="title-action ${x =>
                    title.isInteractive ? "interactive-title" : ""}"
                @click="${x => title.action()}"
                @keydown="${(x, c) => title.action(c.event)}"
            >
                ${x => title.text}
            </${button}>
            <${button}
                class="arrow"
                part="arrow-previous"
                @click="${x => previousAction()}"
                @keydown="${(x, c) => previousAction(c.event)}"
            >
                ${
                    definition.previousIcon instanceof Function
                        ? definition.previousIcon(context, definition)
                        : definition.previousIcon ?? ""
                }
            </${button}>
            <${button}
                class="arrow"
                part="arrow-next"
                @click="${x => nextAction()}"
                @keydown="${(x, c) => nextAction(c.event)}"
            >
                ${
                    definition.nextIcon instanceof Function
                        ? definition.nextIcon(context, definition)
                        : definition.nextIcon ?? ""
                }
            </${button}>
        </div>
      <${grid}
        class="picker-grid"
        part="picker-grid"
        generate-header="none"
    >
        ${repeat(
            x => items,
            html`
            <${row}
                role="row"
                role-type="default"
                class="picker-row"
                part="picker-row"
                grid-template-columns="1fr 1fr 1fr 1fr"
            >
            ${repeat(
                x => x,
                html`
                <${cell}
                    tabindex="-1"
                    class="picker-cell ${x => (x.selected ? "selected" : "")}"
                    part="picker-cell"
                    grid-column="${(x, c) => c.index + 1}"
                    @click="${x => x.action()}"
                    @keyup="${(x, c) => x.keyup(c.event)}"
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
export const datePickerTemplate: FoundationElementTemplate<
    ViewTemplate<DatePicker>,
    DatePickerOptions
> = (context, definition) => {
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
            <div slot="end">${
                definition.calendarIcon instanceof Function
                    ? definition.calendarIcon(context, definition)
                    : definition.calendarIcon ?? ""
            }</div>
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
                        ${x =>
                            timePickerTemplate(
                                context,
                                x.getTimes(),
                                x.handleTimeKeydown.bind(x)
                            )}
                    `
                )}
                ${when(
                    x => x.showCalendar,
                    html`
                    <${calendar}
                        class="calendar"
                        part="calendar"
                        @dateselected="${(x, c) => x.handleDateClicked(c.event)}"
                        @keydown="${(x, c) => x.handleCalendarKeydown(button, c.event)}"
                        locale="${x => x.locale}"
                        month="${x => x.calendarMonth}"
                        year="${x => x.calendarYear}"
                        selected-dates="${x => `${x.date || ""}`}"
                        disabled-dates="${x => x.disabledDates}"
                        min-weeks="6">
                            <div
                                slot="title"
                                class="calendar-title-wrap"
                                >
                                <${button}
                                    class="calendar-title ${x =>
                                        x.type === "datetime-local"
                                            ? "interactive-title"
                                            : ""}"
                                    part="calendar-title"
                                    @click="${x => x.monthPickerDispay()}"
                                    @keydown="${(x, c) =>
                                        x.handleCalendarTitleKeydown(c.event)}"
                                >
                                    ${x => x.calendarTitle}
                                </${button}>
                                <div class="calendar-controls" part="calendar-controls">
                                    <${button} class="calendar-control"
                                        @click="${x => x.previousCalendar()}"
                                        @keydown="${(x, c) =>
                                            x.handleCalendarChangeKeydown(-1, c.event)}"
                                    >${
                                        definition.previousIcon instanceof Function
                                            ? definition.previousIcon(context, definition)
                                            : definition.previousIcon ?? ""
                                    }</${button}>
                                    <${button} class="calendar-control"
                                        @click="${x => x.nextCalendar()}"
                                        @keydown="${(x, c) =>
                                            x.handleCalendarChangeKeydown(1, c.event)}"
                                    >${
                                        definition.nextIcon instanceof Function
                                            ? definition.nextIcon(context, definition)
                                            : definition.nextIcon ?? ""
                                    }</${button}>
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
                            definition,
                            x.arrayToMatrix(x.getMonths(), 4),
                            {
                                text: x.dateFormatter.getYear(x.monthView),
                                action: x.yearPickerDisplay.bind(x, true),
                                isInteractive: x.type.indexOf("date") >= 0,
                            },
                            x.handleMonthChange.bind(x, -1),
                            x.handleMonthChange.bind(x, 1),
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
                            definition,
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
