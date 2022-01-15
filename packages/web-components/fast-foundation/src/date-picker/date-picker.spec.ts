import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { Button, buttonTemplate } from "../button";
import { Calendar, calendarTemplate } from "../calendar";
import {
    dataGridTemplate,
    DataGrid,
    DataGridCell,
    DataGridRow,
    dataGridRowTemplate,
    dataGridCellTemplate
} from "../data-grid/index";
import { DateFormatter } from "../calendar/date-formatter";
import { DatePicker, datePickerTemplate } from "./index";
import { ListboxElement, listboxTemplate } from "../listbox";
import { ListboxOption, listboxOptionTemplate } from "../listbox-option";
import { DOM } from "@microsoft/fast-element";

/**
 * A fast-data-grid-cell used for the calendar and month/year picker
 */
const FASTDataGridCell = DataGridCell.compose({
    baseName: "data-grid-cell",
    template: dataGridCellTemplate
});

/**
 * A fast-data-grid-row used for the calendar and month/year picker
 */
const FASTDataGridRow = DataGridRow.compose({
    baseName: "data-grid-row",
    template: dataGridRowTemplate
});

/**
 * A fast-data-grid used for the calendar and month/year picker
 */
const FASTDataGrid = DataGrid.compose({
    baseName: "data-grid",
    template: dataGridTemplate
});

/**
 * Calendar used for date picking
 */
const FASTCalendar = Calendar.compose({
    baseName: "calendar",
    template: calendarTemplate
});

/**
 * Button used for chaning calendar, month and year views
 */
const FASTButton = Button.compose({
    baseName: "button",
    template: buttonTemplate
});

/**
 * listbox-option used for time picking
 */
const FASTListboxOption = ListboxOption.compose({
    baseName: "listbox-option",
    template: listboxOptionTemplate
});

/**
 * Listbox used for time picking
 */
const FASTListbox = ListboxElement.compose({
    baseName: "listbox",
    tempalte: listboxTemplate
});

/** date-picker initialization */
const FASTDatePicker = DatePicker.compose({
    baseName: "date-picker",
    tempate: datePickerTemplate
});

/**
 * Sets up a date-picker component, sets property values and initializes dependant components
 * @param props - An obect with properties as keys and values as key-values
 * @returns - An object with a handle to the element, the document and connect and disconnect handlers
 */
async function setup(props?) {
    const { document, element, connect, disconnect }: {
        document: Document,
        element: HTMLElement & DatePicker,
        connect: () => void,
        disconnect: () => void
    } = await fixture(
        [FASTDatePicker(), FASTButton(), FASTCalendar(), FASTDataGrid(), FASTDataGridRow(), FASTDataGridCell(), FASTListbox(), FASTListboxOption()]
    );

    for(const key in props) {
        element.setAttribute(key, props[key]);
    }

    await connect();

    await DOM.nextUpdate();

    return { connect, disconnect, document, element };
}

describe("Defaults", () => {
    it("Should default to today's date", async () => {
        const { element, disconnect } = await setup();
        const now = new Date()

        await disconnect();
    });

    /*
    it("", async () => {
        const { element, disconnect } = await setup();

        expect(element).to.equal();

        await disconnect();
    });
    */
});
