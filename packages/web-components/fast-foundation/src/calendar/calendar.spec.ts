import { Updates } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTCalendar, calendarTemplate } from "./index.js";
import { DateFormatter } from "./date-formatter.js";
import {
    dataGridTemplate,
    FASTDataGrid,
    FASTDataGridCell,
    FASTDataGridRow,
    dataGridRowTemplate,
    dataGridCellTemplate
} from "../data-grid/index.js";


const dataGridCellName = uniqueElementName();
FASTDataGridCell.define({
    name: dataGridCellName,
    template: dataGridCellTemplate()
});

const dataGridRowName = uniqueElementName();
FASTDataGridRow.define({
    name: dataGridRowName,
    template: dataGridRowTemplate({
        dataGridCell: dataGridCellName
    })
});

const dataGridName = uniqueElementName();
FASTDataGrid.compose({
    name: dataGridName,
    template: dataGridTemplate({
        dataGridRow: dataGridRowName
    })
});

/**
 * initialization of the custom <fast-calendar/> element
 */
const calendarName = uniqueElementName();
FASTCalendar.define({
    name: calendarName,
    template: calendarTemplate({
        dataGrid: dataGridName,
        dataGridRow: dataGridRowName,
        dataGridCell: dataGridCellName
    })
});

async function setup(props?: {}) {
    const { document, element, connect, disconnect }: {
        document: Document,
        element: HTMLElement & FASTCalendar,
        connect: () => void,
        disconnect: () => void
    } = await fixture<FASTCalendar>(calendarName);

    element.locale = "en-US";

    for(const key in props) {
        element.setAttribute(key, props[key]);
    }

    await connect();

    await Updates.next();

    return { document, element, connect, disconnect };
}

describe("Calendar", () => {
    describe("DateFormatter", () => {
        it("Should be able to set properties on construction", () => {
            const locale = "en-US";
            const dayFormat = "2-digit";
            const monthFormat = "narrow";
            const yearFormat = "2-digit";
            const weekdayFormat = "short";
            const date = new Date("1-1-2021");
            const formatter = new DateFormatter({
                locale,
                dayFormat,
                monthFormat,
                yearFormat,
                weekdayFormat,
                date
            });

            expect(formatter.locale).to.equal(locale);
            expect(formatter.dayFormat).to.equal(dayFormat);
            expect(formatter.monthFormat).to.equal(monthFormat);
            expect(formatter.yearFormat).to.equal(yearFormat);
            expect(formatter.weekdayFormat).to.equal(weekdayFormat);
            expect(formatter.date.getDate()).to.equal(1);
            expect(formatter.date.getMonth()).to.equal(0);
            expect(formatter.date.getFullYear()).to.equal(2021);
        });

        it("Should return a date string for today by default", () => {
            const formatter = new DateFormatter();
            const today = new Date();

            expect(formatter.getDate()).to.equal(formatter.getDate(today));
        });

        it("Should be able to get a date string for a specific date", () => {
            const formatter = new DateFormatter();
            const day = 2;
            const month = 1;
            const year = 2020;
            const dateString = `${month}/${day}/${year}`;
            const date = new Date(year, month -  1, day);

            expect(formatter.getDate(date, {month: 'numeric', day: 'numeric', year: 'numeric'})).to.equal(dateString,);
        });

        it("Should default formatting to [weekday='long'], [month='long'] [day='numeric'], [year='numeric'] string", () => {
            const formatter = new DateFormatter({date: "1-1-2020"});

            expect(formatter.getDate()).to.equal("Wednesday, January 1, 2020");
        });

        it("Should be able to change formats", () => {
            const formatter = new DateFormatter({
                weekdayFormat: undefined,
                monthFormat: "short",
                date: new Date(2020, 0, 1)
            });

            expect(formatter.getDate()).to.equal("Jan 1, 2020");

            formatter.dayFormat = "2-digit";

            expect(formatter.getDate()).to.equal("Jan 01, 2020");
            expect(formatter.getDate("1-1-2020", {
                month: "narrow",
                day: "2-digit",
                year: "2-digit"
            })).to.equal("J 01, 20");
        });

        it("Should return todays day by default for getDay()", () => {
            const formatter = new DateFormatter();
            const today = new Date();

            expect(formatter.getDay()).to.equal(today.getDate().toString());
        });

        it("Should return formatted days with getDay()", () => {
            const formatter = new DateFormatter();

            expect(formatter.getDay(14)).to.equal("14");
            expect(formatter.getDay(8, '2-digit')).to.equal("08");
        });

        it("Should return this month by default for getMonth()", () => {
            const formatter = new DateFormatter();
            const today = new Date();
            const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ];

            expect(formatter.getMonth()).to.equal(months[today.getMonth()]);
        });

        it("Should return formatted month with getMonth()", () => {
            const formatter = new DateFormatter();

            expect(formatter.getMonth(1)).to.equal("January");
            expect(formatter.getMonth(2, "short")).to.equal("Feb");
            expect(formatter.getMonth(3, "narrow")).to.equal("M");
            expect(formatter.getMonth(4, "numeric")).to.equal("4");
            expect(formatter.getMonth(5, "2-digit")).to.equal("05");
        });

        it("Should return this year by default for getYear()", () => {
            const formatter = new DateFormatter();
            const today = new Date();

            expect(formatter.getYear()).to.equal(today.getFullYear().toString());
        });

        it("Should return formatted year with getYear()", () => {
            const formatter = new DateFormatter({yearFormat: "2-digit"});

            expect(formatter.getYear(2012)).to.equal("12");
            expect(formatter.getYear(2015, "numeric")).to.equal("2015");
        });

        it("Should return formatted weekday string with getWeekday()", () => {
            const formatter = new DateFormatter();

            //defaults to sunday
            expect(formatter.getWeekday()).to.equal("Sunday");
            expect(formatter.getWeekday(2)).to.equal("Tuesday");
            expect(formatter.getWeekday(3, "short")).to.equal("Wed");
            expect(formatter.getWeekday(4, "narrow")).to.equal("T");
        });

        it("Should return a list of formatted weekday labels with getWeekdays()", () => {
            const formatter = new DateFormatter();
            const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            const weekdaysShort = weekdays.map(day => day.substr(0, 3));
            const weekdaysNarrow = weekdays.map(day => day.substr(0, 1));

            expect(formatter.getWeekdays().toString()).to.equal(weekdays.toString());
            expect(formatter.getWeekdays("short").toString()).to.equal(weekdaysShort.toString());
            expect(formatter.getWeekdays("narrow").toString()).to.equal(weekdaysNarrow.toString());
        });

        it("Should return a localized string when setting the locale", () => {
            const formatter = new DateFormatter({locale: 'fr-FR', date: '3-1-2015'});

            expect(formatter.getDate()).to.equal("dimanche 1 mars 2015");
            expect(formatter.getWeekday(0)).to.equal("dimanche");
            expect(formatter.getMonth(3)).to.equal("mars");
            formatter.locale = "de-DE";
            expect(formatter.getDate()).to.equal("Sonntag, 1. März 2015");
            expect(formatter.getWeekday(0)).to.equal("Sonntag");
            expect(formatter.getMonth(3)).to.equal("März");
        });
    });

    describe("Defaults", () => {
        it("Should default to the current month and year", async () => {
            const { element, disconnect } = await setup();
            const today = new Date();
            const formatter = new DateFormatter();

            expect((element as FASTCalendar).month).to.equal(today.getMonth() + 1 );
            expect((element as FASTCalendar).year).to.equal(today.getFullYear());

            await disconnect();
        });

        it("Should return 5 weeks of days for August 2021", async () => {
            const { element, disconnect } = await setup({month: 8, year: 2021});

            expect((element as FASTCalendar).getDays().length).to.equal(5);
            expect(element.shadowRoot?.querySelectorAll("[part='week']").length).to.equal(5);
            expect(element.shadowRoot?.querySelectorAll("[part='day']").length).to.equal(35);

            await disconnect();
        });

        it("Should return 6 weeks of days for August 2021 when min-weeks is set to 6", async () => {
            const { element, disconnect } = await setup({month: 8, year: 2021, 'min-weeks': 6});

            expect((element as FASTCalendar).getDays().length).to.equal(6);
            expect(element.shadowRoot?.querySelectorAll("[part='week']").length).to.equal(6);
            expect(element.shadowRoot?.querySelectorAll("[part='day']").length).to.equal(42);

            await disconnect();
        });

        it("Should highlight the current date", async () => {
            const { element, disconnect } = await setup();

            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            const dateString = `${month}-${day}-${year}`;
            const classNames = (element as FASTCalendar).getDayClassNames({day, month, year}, dateString);

            expect(classNames.indexOf("today") >= 0).to.equal(true);
            expect(element.shadowRoot?.querySelector(".today .date")?.innerHTML?.trim()).to.equal(day.toString());

            await disconnect();
        });
    });

    describe("Month info", () => {
        it("Should be 31 days in January", async () => {
            const { element, disconnect } = await setup({month: 1, year: 2021});

            await Updates.next();
            const info = (element as FASTCalendar).getMonthInfo();
            expect(info.length).to.equal(31);

            const daysTotal = element.shadowRoot?.querySelectorAll(".day");
            const inactiveDays = element.shadowRoot?.querySelectorAll(".inactive");
            expect(daysTotal && inactiveDays && daysTotal?.length - inactiveDays?.length).to.equal(31);

            await disconnect();
        });

        it("Should be 28 days in February", async () => {
            const { element, disconnect } = await setup({month: 2, year: 2021});

            const info = (element as FASTCalendar).getMonthInfo();
            expect(info.length).to.equal(28);

            const daysTotal = element.shadowRoot?.querySelectorAll(".day");
            const inactiveDays = element.shadowRoot?.querySelectorAll(".inactive");
            expect(daysTotal && inactiveDays && daysTotal?.length - inactiveDays?.length).to.equal(28);

            await disconnect();
        });

        it("Should be 29 days in February for a leap year", async () => {
            const { element, disconnect } = await setup({month: 2, year: 2020});

            const info = (element as FASTCalendar).getMonthInfo();
            expect(info.length).to.equal(29);

            const daysTotal = element.shadowRoot?.querySelectorAll(".day");
            const inactiveDays = element.shadowRoot?.querySelectorAll(".inactive");
            expect(daysTotal && inactiveDays && daysTotal?.length - inactiveDays?.length).to.equal(29);

            await disconnect();
        });

        it("Should start on Friday for January 2021", async () => {
            const { element, disconnect } = await setup({month: 1, year: 2021});

            const info = (element as FASTCalendar).getMonthInfo();
            expect(info.start).to.equal(5);

            const days = element.shadowRoot?.querySelectorAll(".date");
            expect(days && days[5].innerHTML.trim()).to.equal("1");

            await disconnect();
        });

        it("Should start on Monday for February 2021", async () => {
            const { element, disconnect } = await setup({month: 2, year: 2021});

            const info = (element as FASTCalendar).getMonthInfo();
            expect(info.start).to.equal(1);

            const days = element.shadowRoot?.querySelectorAll(".date");
            expect(days && days[1].innerHTML.trim()).to.equal("1");

            await disconnect();
        });
    });

    describe("Labels", () => {
        it("Should return January for month 1", async () => {
            const { element, disconnect } = await setup({month: 1, year: 2021});

            const month = (element as FASTCalendar).dateFormatter.getMonth((element as FASTCalendar).month);
            expect(month).to.equal("January");

            await disconnect();
        });

        it("Should return Jan for month 1 and short format", async () => {
            const { element, disconnect } = await setup({month: 1, year: 2021, 'month-format': 'short'});

            const month = (element as FASTCalendar).dateFormatter.getMonth((element as FASTCalendar).month);
            expect(month).to.equal("Jan");

            await disconnect();
        });

        it("Should return Mon for Monday by default", async () => {
            const { element, disconnect } = await setup({month: 1, year: 2021});

            const weekdays = (element as FASTCalendar).dateFormatter.getWeekdays();
            expect(weekdays[1]).to.equal("Mon");

            const weekdayLabel = element.shadowRoot?.querySelectorAll(".week-day")[1].innerHTML?.trim();
            expect(weekdayLabel).to.equal("Mon");

            await disconnect();
        });

        it("Should return Monday weekday for long format", async () => {
            const { element, disconnect } = await setup({month: 1, year: 2021, 'weekday-format': 'long'});

            const weekdays = (element as FASTCalendar).dateFormatter.getWeekdays();
            expect(weekdays[1]).to.equal("Monday");

            const weekdayLabel = element.shadowRoot?.querySelectorAll(".week-day")[1].innerHTML?.trim();
            expect(weekdayLabel).to.equal("Monday");

            await disconnect();
        });

        it("Should return M for Monday for narrow format", async () => {
            const { element, disconnect } = await setup({month: 1, year: 2021, 'weekday-format': 'narrow'});

            const weekdays = (element as FASTCalendar).dateFormatter.getWeekdays();
            expect(weekdays[1]).to.equal("M");

            const weekdayLabel = element.shadowRoot?.querySelectorAll(".week-day")[1].innerHTML?.trim();
            expect(weekdayLabel).to.equal("M");

            await disconnect();
        });
    });

    describe("Localization", () => {
        it("Should be mai for the month May in French", async () => {
            const { element, disconnect } = await setup({month: 5, year: 2021, locale: 'fr-FR'});

            const month = (element as FASTCalendar).dateFormatter.getMonth((element as FASTCalendar).month);
            expect(month).to.equal("mai");

            await disconnect();
        });

        it("Should have French weekday labels for the fr-FR market", async () => {
            const { element, disconnect } = await setup({month: 5, year: 2021, locale: 'fr-FR'});

            const frenchWeekdays = [ "dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam." ];
            const weekdays = (element as FASTCalendar).dateFormatter.getWeekdays();
            const matchedDays = weekdays.filter((day, index) => day === frenchWeekdays[index]);
            expect(matchedDays.length).to.equal(7);

            const weekdayLabels = element.shadowRoot?.querySelectorAll('.week-day');
            const weekdayText = weekdayLabels ? Array.from(weekdayLabels).map(elm => elm.innerHTML.trim()) : [];
            const matchedLabels = weekdayText.filter((day, index) => day === frenchWeekdays[index]);
            expect(matchedLabels.length).to.equal(7);

            await disconnect();
        });

        it("Should be 1943 for the year 2021 for the Hindu calendar", async () => {
            const { element, disconnect } = await setup({month: 6, year: 2021, locale: 'hi-IN-u-ca-indian'});

            const year = (element as FASTCalendar).dateFormatter.getYear((element as FASTCalendar).year);
            expect(parseInt(year)).to.equal(1942);

            await disconnect();
        });

        it("Should be 2564 for the year 2021 for the buddhist calendar", async () => {
            const { element, disconnect } = await setup({month: 6, year: 2021, locale: 'th-TH-u-ca-buddhist'});

            const year = (element as FASTCalendar).dateFormatter.getYear((element as FASTCalendar).year);
            const match = year.match(/\d+/);
            expect(match && parseInt(match[0])).to.equal(2564);

            await disconnect();
        });

        it("Should not be RTL for languages that are not Arabic or Hebrew", async () => {
            const { element, disconnect } = await setup({month: 8, year: 2021, locale: 'en-US'});

            const dates = element.shadowRoot?.querySelectorAll(".date");
            const dateStrings = dates ? Array.from(dates).map(date => date.innerHTML.trim()) : [];
            expect(parseInt(dateStrings[0]) < parseInt(dateStrings[1])).to.equal(true);

            await disconnect();
        });

        it("Should be RTL for Arabic language", async () => {
            const { element, disconnect } = await setup({month: 8, year: 2021, locale: 'ar-XE-u-ca-islamic-nu-arab'});

            const dates = element.shadowRoot?.querySelectorAll(".date");
            const dateStrings = dates ? Array.from(dates).map(date => date.innerHTML.trim()) : [];
            expect(parseInt(dateStrings[0]) < parseInt(dateStrings[1])).to.equal(false);

            await disconnect();
        });
    });


    describe("Day states", () => {
        it("Should not show date as disabled by default", async () => {
            const { element, disconnect } = await setup({month: 5, year: 2021});

            expect((element as FASTCalendar).dateInString(`5-7-2021`, (element as FASTCalendar).disabledDates)).to.equal(false);
            expect((element as FASTCalendar).getDayClassNames({month: 5, day: 7, year: 2021}).indexOf("disabled") < 0).to.equal(true);

            const disabled = element.shadowRoot?.querySelectorAll(".disabled");
            expect(disabled && disabled.length).to.equal(0);

            await disconnect();
        });

        it("Should show date as disabled when added to disabled-dates attribute", async () => {
            const { element, disconnect } = await setup({month: 5, year: 2021, 'disabled-dates': '5-6-2021,5-7-2021,5-8-2021'});

            expect((element as FASTCalendar).dateInString("5-7-2021", (element as FASTCalendar).disabledDates)).to.equal(true);
            expect((element as FASTCalendar).getDayClassNames({month: 5, day: 7, year: 2021, disabled: true}).indexOf("disabled") >= 0).to.equal(true);

            const disabled = element.shadowRoot?.querySelectorAll(".disabled");
            expect(disabled && disabled.length).to.equal(3);

            await disconnect();
        });

        it("Should not show date as selected by default", async () => {
            const { element, disconnect } = await setup({month: 5, year: 2021});

            expect((element as FASTCalendar).dateInString(`5-7-2021`, (element as FASTCalendar).selectedDates)).to.equal(false);
            expect((element as FASTCalendar).getDayClassNames({month: 5, day: 7, year: 2021}).indexOf("selected") < 0).to.equal(true);

            const selected = element.shadowRoot?.querySelectorAll(".selected");
            expect(selected && selected.length).to.equal(0);

            await disconnect();
        });

        it("Should show date as selected when added to selected-dates attribute", async () => {
            const { element, disconnect } = await setup({month: 5, year: 2021, 'selected-dates': '5-6-2021,5-7-2021,5-8-2021'});

            expect((element as FASTCalendar).dateInString(`5-7-2021`, (element as FASTCalendar).selectedDates)).to.equal(true);
            expect((element as FASTCalendar).getDayClassNames({month: 5, day: 7, year: 2021, selected: true}).indexOf("selected") >= 0).to.equal(true);

            const selected = element.shadowRoot?.querySelectorAll(".selected");
            expect(selected && selected.length).to.equal(3);

            await disconnect();
        });
    });
});
