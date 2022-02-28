import { html, ref, repeat, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { AnchoredRegion } from "../anchored-region";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { DataGrid, DataGridCell, DataGridRow } from "../data-grid";
import { Listbox } from "../listbox";
import { ListboxOption } from "../listbox-option";
import { TextField } from "../text-field";
import type { ElementDefinitionContext } from "../design-system";
import type { DatePicker, DatePickerOptions } from "./date-picker";

/**
 * Template used for selecting hour, minute and meridian
 * @param context
 * @param reference
 * @param items
 * @returns
 */
export const timeSelectorTemplate = (context, reference, items, action) => {
    const listbox = context.tagFor(Listbox);
    const listboxOption = context.tagFor(ListboxOption);

    return html`
        <div class="scroller">
            <${listbox} ${ref(reference)}>
                ${repeat(
                    x => items,
                    html`
                    <${listboxOption} value="${x => x.value}" @click="${x =>
                        action(x.value)}">
                        ${x => x.text}
                    </${listboxOption}>
                `
                )}
            </${listbox}>
        </div>
    `;
};

/**
 * Template to render a time picker menu
 * @param times - labels and values for times, hours, minutes and meridian
 * @returns - A ViewTemplate
 */
export const timePickerTemplate: (
    context: ElementDefinitionContext,
    times: any
) => ViewTemplate = (context: ElementDefinitionContext, times: any) => {
    return html`
        <div class="time-picker">
            ${x =>
                timeSelectorTemplate(
                    context,
                    "hour-ref",
                    times.hours,
                    x.handleHourSelect.bind(x)
                )}
            ${x =>
                timeSelectorTemplate(
                    context,
                    "minute-ref",
                    times.minutes,
                    x.handleMinuteSelect.bind(x)
                )}
            ${x =>
                timeSelectorTemplate(
                    context,
                    "meridian-ref",
                    times.meridians,
                    x.handleMeridianSelect.bind(x)
                )}
        </div>
    `;
};

/**
 * Template used to render the month and year pickers
 * @param context
 * @param items
 * @param title
 * @returns
 */
const pickerTemplate = (
    context: ElementDefinitionContext,
    items: {
        text: string;
        action: () => void;
        selected: boolean;
    }[][],
    title: {
        text: string;
        action: () => void;
        previous: () => void;
        next: () => void;
    }
) => {
    const dataGrid = context.tagFor(DataGrid);
    const dataGridRow = context.tagFor(DataGridRow);
    const dataGridCell = context.tagFor(DataGridCell);
    const button = context.tagFor(Button) || "fast-button";

    return html`
    <div class="picker">
        <div class="title" @keydown="${(x, c) => {
            switch ((c.event as KeyboardEvent).key) {
                case "ArrowUp":
                    title.next();
                    return false;
                case "ArrowDown":
                    title.previous();
                    return false;
            }
            return true;
        }}">
            <${button} @click="${x => title.action()}">
                ${x => title.text}
            </${button}>
            <${button} class="arrow" part="previous-arrow" @click="${x =>
        title.previous()}">
                &downarrow;
            </${button}>
            <${button} class="arrow" part="next-arrow" @click="${x => title.next()}">
                &uparrow;
            </${button}>
        </div>
        <${dataGrid} class="picker-grid" part="picker-grid" generate-header="none">
            ${repeat(
                x => items,
                html`
                <${dataGridRow} class="picker-row" part="picker-row" role="row" role-type="default" grid-template-columns="1fr 1fr 1fr 1fr">
                    ${repeat(
                        x => x,
                        html`
                        <${dataGridCell}
                            class="picker-cell ${x => (x.selected ? "selected" : "")}"
                            part="picker-cell"
                            tab-index="-1"
                            grid-column="${(x, c) => c.index + 1}"
                            @click="${x => x.action()}"
                            @keydown="${(x, c) => {
                                if ((c.event as KeyboardEvent).key === "Enter") {
                                    x.action();
                                }
                                return true;
                            }}">
                            ${x => x.text}
                        </${dataGridCell}>

                    `,
                        { positioning: true }
                    )}
                </${dataGridRow}>
            `
            )}
        </${dataGrid}>
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
    context: ElementDefinitionContext,
    definition: DatePickerOptions
) => ViewTemplate<DatePicker> = (
    context: ElementDefinitionContext,
    definition: DatePickerOptions
) => {
    const anchoredRegion: string = context.tagFor(AnchoredRegion);
    const calendar: string = context.tagFor(Calendar);

    return html`
        <template
            @mouseover="${x => (x.overMenu = true)}"
            @mouseout="${x => (x.overMenu = false)}"
        >
            <div class="label"><slot></slot></div>
            <div class="root" part="root" @click="${x => x.openMenu()}" ref="inputfield">
                <input
                    type="text"
                    class="control"
                    part="control"
                    ${ref("control")}
                    placeholder="${x => x.placeholder}"
                    @blur="${x => x.handleBlur()}"
                />
                <span class="icon" @click="${(x, c) => x.toggleMenu(true, c.event)}">
                    <slot name="icon" aria-label="Choose date">&#128197;</slot>
                </span>
            </div>
            <div class="flyout ${x => (x.menuOpen ? "open" : "")}">
                ${when(
                    x => x.type === "date" || x.type === "datetime-local",
                    html`
                        <${calendar}
                            class="calendar"
                            month="${x => x.month}"
                            year="${x => x.year}"
                            selected-dates="${x => x.selectedDate}"
                            @dateselected="${(x, c) => x.handleDateSelect(c.event)}"
                            locale="${x => x.locale}"
                        ></${calendar}>
                    `
                )}
                ${when(
                    x => x.type === "date" || x.type === "month",
                    html`
                        ${x => {
                            const dateFormatter = x.getFormatter("yearFormat");
                            return pickerTemplate(context, x.getMatrix(), {
                                text: dateFormatter.getYear(x.yearView),
                                next: () => (x.yearView += 1),
                                previous: () => (x.yearView -= 1),
                                action: () => void 0,
                            });
                        }}
                    `
                )}
                ${when(
                    x => x.type === "month" || x.type === "year",
                    html`
                        ${x => {
                            const dateFormatter = x.getFormatter("yearFormat");
                            return pickerTemplate(context, x.getMatrix("year"), {
                                text: `${dateFormatter.getYear(
                                    x.yearsView
                                )} - ${dateFormatter.getYear(x.yearsView + 11)}`,
                                next: () => (x.yearsView += 12),
                                previous: () => (x.yearsView -= 12),
                                action: () => void 0,
                            });
                        }}
                    `
                )}
                ${when(
                    x => x.type === "time" || x.type === "datetime-local",
                    html`
                        ${x => timePickerTemplate(context, x.getTimes())}
                    `
                )}
            </div>
        </template>
    `;
};
