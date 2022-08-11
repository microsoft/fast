import { html, ref, repeat, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import {
    FASTAnchoredRegion,
    FASTButton,
    FASTCalendar,
    FASTDataGrid,
    FASTDataGridCell,
    FASTDataGridRow,
    FASTListboxElement,
    FASTListboxOption,
    FASTTextField,
} from "@microsoft/fast-foundation";
import { tagFor } from "../patterns/tag-for.js";
import type { DatePickerOptions, FASTDatePicker } from "./date-picker.js";

/**
 *  Generic template for handling a time element selection
 * @param context - Control context
 * @param values - List of objects of possible values
 * @param keydownHandler - keyboard handler
 * @param type - type of time select
 * @returns template
 */
const timeElementSelect = (
    keydownHandler: (type: string, event: Event) => {},
    values: {}[],
    type: string
) => {
    const listbox = tagFor(FASTListboxElement);
    const listboxOption = tagFor(FASTListboxOption);

    return html`
            <${listbox}
                class="time-list"
                part="time-list"
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
    times: {
        hours: {}[];
        minutes: {}[];
        meridians: {}[];
    },
    timeKeydown: (unit: string, event: KeyboardEvent) => boolean
) => {
    const timeSelectTemplate = timeElementSelect.bind(this, timeKeydown);
    return html`
        <div class="time-picker" part="time-picker">
            ${x => timeSelectTemplate(times.hours, "hour")}
            <div class="time-separator" part="time-separator">:</div>
            ${x => timeSelectTemplate(times.minutes, "minute")}
            ${x => timeSelectTemplate(times.meridians, "meridian")}
        </div>
    `;
};

/**
 * Template for displaying a picker title
 * @param context - control context
 * @param text - title text
 * @param showYears - should show the year menu on click
 * @returns - title template
 */
const pickerTitleTemplate = (text: string, showYears: boolean) => {
    const button = tagFor(FASTButton);

    return html`
        <${button}
            class="title-action ${x =>
                x.type.indexOf("date") >= 0 ? "interactive-title" : ""}"
            @click="${x => x.yearPickerDisplay(showYears)}"
            @keydown="${(x, c) => x.yearPickerDisplay(showYears, c.event)}"
        >
            ${text}
        </${button}>
    `;
};

/**
 * Template for change controls to change the displayed range
 * @param context - control context
 * @param definition - date picker options
 * @param changeAction - action when clicking on controls
 * @returns changer template
 */
const pickerChangeControlsTemplate = (
    options: DatePickerOptions,
    changeAction: (direction: number, event?: Event) => boolean
) => {
    const button = tagFor(FASTButton);

    return html`
        <${button}
            class="arrow"
            part="arrow-previous"
            @click="${x => changeAction(-1)}"
            @keydown="${(x, c) => changeAction(-1, c.event)}"
        >
            ${
                options.previousIcon instanceof Function
                    ? options.previousIcon
                    : options.previousIcon ?? ""
            }
        </${button}>
        <${button}
            class="arrow"
            part="arrow-next"
            @click="${x => changeAction(1)}"
            @keydown="${(x, c) => changeAction(1, c.event)}"
        >
            ${
                options.nextIcon instanceof Function
                    ? options.nextIcon
                    : options.nextIcon ?? ""
            }
        </${button}>
    `;
};

/**
 * Template for display a grid of items
 * @param context - control context
 * @param items - Items to display in the grid
 * @returns grid template
 */
const pickerGridTemplate = (items: {}[]) => {
    const grid = tagFor(FASTDataGrid);
    const row = tagFor(FASTDataGridRow);
    const cell = tagFor(FASTDataGridCell);

    return html`
        <${grid}
            class="picker-grid"
            part="picker-grid"
            generate-header="none"
        >
        ${repeat(
            x => x.arrayToMatrix(items, 4),
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
    `;
};

/**
 *
 * @param context - The date-picker class context
 * @param definition - Date-picker options
 * @returns - A ViewTemplate
 * @public
 */
export function datePickerTemplate(options: DatePickerOptions) {
    const textField: string = tagFor(FASTTextField);
    const anchoredRegion: string = tagFor(FASTAnchoredRegion);
    const button: string = tagFor(FASTButton);
    const calendar: string = tagFor(FASTCalendar);
    const resetButton: ViewTemplate<FASTDatePicker> = html`<${button} class="reset-text" part="reset-text" @click="${x =>
        x.resetCalendar()}">${x => x.resetText}</${button}>`;

    return html<FASTDatePicker>`
    <template
        @mouseover="${x => (x.overFlyout = true)}"
        @mouseout="${x => (x.overFlyout = false)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event)}"
        @focus="${x => x.handleFocus()}"
    >
       <${textField}
            class="text-field"
            part="text-field"
            name=${x => x.name}
            @click="${x => (!x.readonly ? x.toggleFlyout(true) : () => true)}"
            ?readonly="${x => x.readonly}"
            placeholder="${x => x.placeholder}"
            appearance="${x => x.appearance}"
            ?disabled="${x => x.disabled}"
            ?required="${x => x.required}"
            @blur="${x => x.handleBlur()}"
            @keyup="${(x, c) => x.handleKeyup(c.event as KeyboardEvent)}"
            ${ref("textField")}
        >
            <slot slot="start" name="start" part="start"></slot>
            <slot></slot>
            <slot name="end" slot="end" part="end">
                ${
                    options.calendarIcon instanceof Function
                        ? options.calendarIcon
                        : options.calendarIcon ?? ""
                }
            </slot>
        </${textField}>
        ${when(
            x => !x.readonly && !x.disabled && x.flyoutOpen,
            html`
            <${anchoredRegion}
                class="flyout"
                part="flyout"
                :anchorElement="${x => x.textField}"
                vertical-positioning-mode="dynamic"
                vertical-default-position="bottom"
                horizontal-positioning-mode="dynamic"
                horizontal-inset="true"
                horizontal-default-position="start"
                @keydown="${(x, c) => x.handleFlyoutKeydown(c.event)}"
            >
                ${when(
                    x => x.type === "datetime-local" || x.type === "time",
                    html`
                        ${x =>
                            timePickerTemplate(x.getTimes(), x.handleTimeKeydown.bind(x))}
                    `
                )}
                ${when(
                    x => x.showCalendar,
                    html`
                    <${calendar}
                        class="calendar"
                        part="calendar"
                        @dateselected="${(x, c) => x.handleDateClicked(c.event)}"
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
                                    @click="${x => x.monthPickerDisplay()}"
                                    @keydown="${(x, c) =>
                                        x.handleCalendarTitleKeydown(c.event)}"
                                >
                                    ${x => x.calendarTitle}
                                </${button}>
                                <div class="calendar-controls" part="calendar-controls">
                                    <${button} class="calendar-control"
                                        @click="${(x, c) =>
                                            x.handleCalendarChange(-1, c.event)}"
                                        @keydown="${(x, c) =>
                                            x.handleCalendarChange(-1, c.event)}"
                                    >${
                                        options.previousIcon instanceof Function
                                            ? options.previousIcon
                                            : options.previousIcon ?? ""
                                    }</${button}>
                                    <${button} class="calendar-control"
                                        @click="${(x, c) =>
                                            x.handleCalendarChange(1, c.event)}"
                                        @keydown="${(x, c) =>
                                            x.handleCalendarChange(1, c.event)}"
                                    >${
                                        options.nextIcon instanceof Function
                                            ? options.nextIcon
                                            : options.nextIcon ?? ""
                                    }</${button}>
                                </div>
                            </div>
                        </${calendar}>
                `
                )}
                ${when(
                    x => x.showMonthPicker,
                    html`
                        <div class="picker" part="picker">
                            <div class="picker-title" part="picker-title">
                                ${x =>
                                    pickerTitleTemplate(
                                        x.dateFormatter.getYear(x.monthView),
                                        true
                                    )}
                                ${x =>
                                    pickerChangeControlsTemplate(
                                        options,
                                        x.handleMonthChange.bind(x)
                                    )}
                            </div>
                            ${x => pickerGridTemplate(x.getMonths())} ${resetButton}
                        </div>
                    `
                )}
                ${when(
                    x => x.showYearPicker,
                    html`
                        <div class="picker" part="picker">
                            <div class="picker-title" part="picker-title">
                                ${x => {
                                    const years = x.getYears();
                                    return pickerTitleTemplate(
                                        `${years[0].text} - ${
                                            years[years.length - 1].text
                                        }`,
                                        false
                                    );
                                }}
                                ${x =>
                                    pickerChangeControlsTemplate(
                                        options,
                                        x.handleYearsChange.bind(x)
                                    )}
                            </div>
                            ${x => pickerGridTemplate(x.getYears())} ${resetButton}
                        </div>
                    `
                )}
            </${anchoredRegion}>
        `
        )}
    </template>
`;
}
