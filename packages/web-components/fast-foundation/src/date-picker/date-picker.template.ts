import { html, ref, repeat, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { AnchoredRegion } from "../anchored-region";
import { Button } from "../button";
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
export const timeSelectorTemplate = (context, reference, items) => {
    const listbox = context.tagFor(Listbox);
    const listboxOption = context.tagFor(ListboxOption);

    return html`
        <div class="scroller">
            <${listbox} ${ref(reference)}>
                ${repeat(
                    x => items,
                    html`
                    <${listboxOption} value="${x => x.value}" @click="${x => x.action()}">
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
            ${x => timeSelectorTemplate(context, "hour-ref", times.hours)}
            <div class="seperator">:</div>
            ${x => timeSelectorTemplate(context, "minute-ref", times.minutes)}
            ${x => timeSelectorTemplate(context, "meridian-ref", times.meridians)}
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
        <${dataGrid} generate-hdeader="none">
            ${repeat(
                x => items,
                html`
                <${dataGridRow} role="row" role-type="default" grid-template-columns="1fr 1fr 1fr 1fr">
                    ${repeat(
                        x => x,
                        html`
                        <${dataGridCell}
                            class="cell ${x => (x.selected ? "selected" : "")}"
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

    return html`
        <template
            @mouseover="${x => (x.overMenu = true)}"
            @mouseout="${x => (x.overMenu = false)}"
        >
            <div class="label"><slot></slot></div>
            <div class="input-field" @click="${x => x.toggleMenu()}" ref="inputfield">
                <div class="date">${x => x.value || x.placeholder}</div>
                <span class="icon">
                    <slot name="icon" aria-label="Choose date">&#128197;</slot>
                </span>
            </div>
            <div class="flyout">
                ${when(
                    x => x.type === "time" || x.type === "datetime-local",
                    html`
                        ${x => timePickerTemplate(context, x.getTimes())}
                    `
                )}
                ${when(
                    x => x.type !== "time",
                    html`
                        ${x => {
                            return pickerTemplate(context, x.getMatrix(), {
                                text: x.yearView,
                                next: () => (x.yearView += 1),
                                previous: () => (x.yearView -= 1),
                                action: () => void 0,
                            });
                        }}
                        ${x => {
                            return pickerTemplate(context, x.getMatrix("year"), {
                                text: `${x.yearsView} - ${x.yearsView + 11}`,
                                next: () => (x.yearsView += 12),
                                previous: () => (x.yearsView -= 12),
                                action: () => void 0,
                            });
                        }}
                    `
                )}
            </div>
        </template>
    `;
};
