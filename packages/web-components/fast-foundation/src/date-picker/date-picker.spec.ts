import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTDatePicker, datePickerTemplate } from "./index.js";
import {
    buttonTemplate,
    calendarTemplate,
    dataGridCellTemplate,
    dataGridRowTemplate,
    dataGridTemplate,
    DateFormatter,
    FASTButton,
    FASTCalendar,
    FASTDataGrid,
    FASTDataGridCell,
    FASTDataGridRow,
    FASTListboxElement,
    FASTListboxOption,
    listboxOptionTemplate,
    listboxTemplate
} from "@microsoft/fast-foundation";
import { DOM } from "@microsoft/fast-element";

/**
 * A fast-data-grid-cell used for the calendar and month/year picker
 */
const dataGridCellName = uniqueElementName();
FASTDataGridCell.define({
    name: dataGridCellName,
    template: dataGridCellTemplate
});

/**
 * A fast-data-grid-row used for the calendar and month/year picker
 */
const dataGridRowName = uniqueElementName();
FASTDataGridRow.define({
    name: dataGridRowName,
    template: dataGridRowTemplate
});

/**
 * A fast-data-grid used for the calendar and month/year picker
 */
const dataGridName = uniqueElementName();
FASTDataGrid.define({
    name: dataGridName,
    template: dataGridTemplate
});

/**
 * Calendar used for date picking
 */
const calendarName = uniqueElementName();
FASTCalendar.define({
    name: calendarName,
    template: calendarTemplate
});

/**
 * Button used for chaning calendar, month and year views
 */
const buttonName = uniqueElementName();
FASTButton.define({
    name: buttonName,
    template: buttonTemplate
});

/**
 * listbox-option used for time picking
 */
const listboxOptionName = uniqueElementName();
FASTListboxOption.define({
    name: listboxOptionName,
    template: listboxOptionTemplate
});

/**
 * Listbox used for time picking
 */
const listboxName = uniqueElementName();
FASTListboxElement.define({
    name: listboxName,
    tempalte: listboxTemplate
});

/** date-picker initialization */
const datePickerName = uniqueElementName();
FASTDatePicker.compose({
    name: datePickerName,
    tempate: datePickerTemplate
});

/**
 * Sets up a date-picker component, sets property values and initializes dependant components
 * @param props - An obect with properties as keys and values as key-values
 * @returns - An object with a handle to the element, the document and connect and disconnect handlers
 */
async function setup(props?: {}) {
    const { document, element, connect, disconnect }: {
        document: Document,
        element: HTMLElement & FASTDatePicker,
        connect: () => void,
        disconnect: () => void
    } = await fixture(
        [
            DatePicker(),
            Button(),
            Calendar(),
            DataGrid(),
            DataGridRow(),
            DataGridCell(),
            Listbox(),
            ListboxOption()
        ]
    );

    for(const key in props) {
        element.setAttribute(key, props[key]);
    }

    await connect();

    await DOM.nextUpdate();

    return { connect, disconnect, document, element };
}

describe("DatePicker", () => {
    describe("Defaults", () => {
        it("Should default to type='date'", async () => {
            const { element, disconnect } = await setup();

            expect(element.type).to.equal("date");

            await disconnect();
        });

        it("Should default locale to 'en-us'", async () => {
            const { element, disconnect } = await setup();

            expect(element.locale.toLocaleLowerCase()).to.equal("en-us");

            await disconnect();
        });

        it("Should default day format to numeric", async () => {
            const { element, disconnect } = await setup({value: 'december 31, 1999'});

            expect(element.dayFormat).to.equal("numeric");
            expect(element.value).to.equal("12/31/1999");

            await disconnect();
        });

        it("Should default month format to numeric", async () => {
            const { element, disconnect } = await setup({value: 'november 5, 2015'});

            expect(element.monthFormat).to.equal("numeric");
            expect(element.value).to.equal("11/5/2015");

            await disconnect();
        });

        it("Should default year format to numeric", async () => {
            const { element, disconnect } = await setup({value: 'august 8, 09'});

            expect(element.yearFormat).to.equal("numeric");
            expect(element.value).to.equal("8/8/2009");

            await disconnect();
        });

        it("Should default hour format to numeric", async () => {
            const { element, disconnect } = await setup();

            expect(element.hourFormat).to.equal("numeric");

            await disconnect();
        });

        it("Should default minute format to 2-digit", async () => {
            const { element, disconnect } = await setup();

            expect(element.minuteFormat).to.equal("2-digit");

            await disconnect();
        });

        it("Should default the calendar to today's month and year", async () => {
            const { element, disconnect } = await setup();
            const now = new Date();

            // expect(element.calendarMonth).to.equal(now.getMonth() + 1);
            expect(element.calendarYear).to.equal(now.getFullYear());

            await disconnect();
        });

        it("Should default the month picker view to today's year", async () => {
            const { element, disconnect } = await setup();
            const now = new Date();

            // expect(element.monthView).to.equal(now.getFullYear());

            await disconnect();
        });

        it("Should default the year picker view to today's year's decade", async () => {
            const { element, disconnect } = await setup();
            const now = new Date();

            // expect(element.yearView).to.equal(Math.floor(now.getFullYear() / 10) * 10);

            await disconnect();
        });

        it("Flyout should be closed by default", async () => {
            const { element, disconnect } = await setup({value: 'december 12, 20'});

            expect(element.flyoutOpen).to.equal(false);


            await disconnect();
        });
    });

    describe("Date picker types", () => {
        it("Should default to display [xx]/[xx]/[xxxx] for type='date'", async () => {
            const { element, disconnect } = await setup({type: 'date', value: "August 17, 2023"});

            expect(element.value).to.equal("8/17/2023");

            await disconnect();
        });

        it("Should display [xx]/[xxxx] for type='month'", async () => {
            const { element, disconnect } = await setup({type: 'month', value: "August 17, 2023"});

            expect(element.value).to.equal("8/2023");

            await disconnect();
        });

        it("Should display [xxxx] for type='year'", async () => {
            const { element, disconnect } = await setup({type: 'year', value: "August 17, 2023"});

            expect(element.value).to.equal("2023");

            await disconnect();
        });

        it("Should display [xx]:[xx] [AM|PM] for type='time'", async () => {
            const { element, disconnect } = await setup({type: 'time', value: "3:30 AM"});

            expect(element.value).to.equal("3:30 AM");

            await disconnect();
        });

        it("Should display '[xx]/[xx]/[xxxx], [xx]:[xx] [AM|PM]' for type='datetime-local'", async () => {
            const { element, disconnect } = await setup({type: 'datetime-local', value: "15:20 dec 17 2018"});

            expect(element.value).to.equal("12/17/2018, 3:20 PM");

            await disconnect();
        });
    });

    describe("Formatting", () => {
        it("Should display default formatting as [xx]/[xx]/[xxxx] for setting a date", async () => {
            const { element, disconnect } = await setup({value: "January 2, 2020"});

            expect(element.value).to.equal("1/2/2020");

            await disconnect();
        });

        it("Should display '[weekday], [xx]/[xx]/[xxxx]' when weekday-format='long'", async () => {
            const { element, disconnect } = await setup({'weekday-format': 'long', value: "jan 13 2021"});

            expect(element.value).to.equal("Wednesday, 1/13/2021");

            await disconnect();
        });

        it("Should display '[three letter weekday], [xx]/[xx]/[xxxx] for weekday-format='short'", async () => {
            const { element, disconnect } = await setup({'weekday-format': 'short', value: "March 17, 2011"});

            expect(element.value).to.equal("Thu, 3/17/2011");

            await disconnect();
        });

        it("Should display '[first letter of weekday], [xx]/[xx]/[xxxx]' for weekday-format='narrow'", async () => {
            const { element, disconnect } = await setup({'weekday-format': 'narrow', value: "dec 12, 2014"});

            expect(element.value).to.equal("F, 12/12/2014");

            await disconnect();
        });

        it("Should display '[full month name] [day], [full year]' when month-format='long'", async () => {
            const { element, disconnect } = await setup({'month-format': 'long', value: "2/14/2024"});

            expect(element.value).to.equal("February 14, 2024");

            await disconnect();
        });

        it("Should display '[first letter of month] [day], [full year]' when month-format='narrow'", async () => {
            const { element, disconnect } = await setup({'month-format': 'narrow', value: "5/18/2016"});

            expect(element.value).to.equal("M 18, 2016");

            await disconnect();
        });

        it("Should display '[xx]/[xx]/[xx] for year-format='2-digit'", async () => {
            const { element, disconnect } = await setup({'year-format': '2-digit', value: "sep 25, 1990"});

            expect(element.value).to.equal("9/25/90");

            await disconnect();
        });

        it("Should display default formatting for setting a date", async () => {
            const { element, disconnect } = await setup({value: "January 2, 2020"});

            expect(element.value).to.equal("1/2/2020");

            await disconnect();
        });
    });

    describe("Localization", () => {
        it("Should display display French text when using locale='fr-fr'", async () => {
            const { element, disconnect } = await setup({locale: "fr-fr"});

            const months = element.getMonths().map(x => x.text);

            // Testing that it returns French month names
            expect(months[0]).to.equal("janv.");
            expect(months[1]).to.equal("févr.");
            expect(months[2]).to.equal("mars");
            expect(months[3]).to.equal("avr.");
            expect(months[4]).to.equal("mai");
            expect(months[5]).to.equal("juin");
            expect(months[6]).to.equal("juil.");
            expect(months[7]).to.equal("août");
            expect(months[8]).to.equal("sept.");
            expect(months[9]).to.equal("oct.");
            expect(months[10]).to.equal("nov.");
            expect(months[11]).to.equal("déc.");

            await disconnect();
        });

        it("Should display [dd]/[mm]/[yyyy] for French date picker using locale='fr-fr'", async () => {
            const { element, disconnect } = await setup({locale: "fr-fr", value: "3/14/2018"});

            expect(element.value).to.equal("14/03/2018");

            await disconnect();
        });

        it("Should display [dd].[mm].[yyyy] for German date picker using locale='de-de'", async () => {
            const { element, disconnect } = await setup({locale: "de-de", value: "10/17/2025"});

            expect(element.value).to.equal("17.10.2025");

            await disconnect();
        });
    });

    describe("Interactions", () => {
        /*
        it("", async () => {
            const { element, disconnect } = await setup();

            expect(element).to.equal();

            await disconnect();
        });
        */
    });
});
