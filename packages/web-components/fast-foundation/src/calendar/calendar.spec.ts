import { customElement, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { Calendar, CalendarTemplate as template } from "./index";

/**
 * initialization of the custome <fast-calendar/> element
 */
@customElement({
    name: "fast-calendar",
    template
})
class FASTCalendar extends Calendar {}

describe("Calendar", () => {

    describe("Defaults", () => {
        it("Should default to the current month and year", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar></fast-calendar>
            `);

            const today = new Date();

            await connect();

            expect((element as FASTCalendar).month).to.equal(today.getMonth() + 1);
            expect((element as FASTCalendar).year).to.equal(today.getFullYear());

            await disconnect();
        });

        it("Should return 6 weeks of days", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar></fast-calendar>
            `);

            await connect();

            expect((element as Calendar).getDays().length).to.equal(42);
        });

        it("Should highlight the current date", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar></fast-calendar>
            `);

            await connect();

            const today = new Date();

            expect((element as Calendar).isToday(today.getFullYear(), today.getMonth() + 1, today.getDate())).to.equal(true);
        })
    });

    describe("Month info", () => {
        it("Should be 31 days in January", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="1" year="2021"></fast-calendar>
            `);

            await connect();

            const info = (element as Calendar).getMonthInfo();
            expect(info.length).to.equal(31);
        });

        it("Should be 28 days in Febuary", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="2" year="2021"></fast-calendar>
            `);

            await connect();

            const info = (element as Calendar).getMonthInfo();
            expect(info.length).to.equal(28);
        });

        it("Should be 29 days in Febuary for leap year", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="2" year="2020"></fast-calendar>
            `);

            await connect();

            const info = (element as Calendar).getMonthInfo();
            expect(info.length).to.equal(29);
        });

        it("Should start on Friday for January 2021", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="1" year="2021"></fast-calendar>
            `);

            await connect();

            const info = (element as Calendar).getMonthInfo();
            expect(info.start).to.equal(5);
        });

        it("Should start on Monday for Febuary 2021", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="2" year="2021"></fast-calendar>
            `);

            await connect();

            const info = (element as Calendar).getMonthInfo();
            expect(info.start).to.equal(1);
        });
    });

    describe("Labels", () => {
        it("Should return January for month 1", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="1" year="2021"></fast-calendar>
            `);

            await connect();

            const month = (element as Calendar).getLocaleMonth();
            expect(month).to.equal("January");
        });

        it("Should return Jan for month 1 and short format", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="1" year="2021" monthFormat="short"></fast-calendar>
            `);

            await connect();

            const month = (element as Calendar).getLocaleMonth();
            expect(month).to.equal("Jan");
        });

        it("Should return Mon for Monday by default", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="1" year="2021"></fast-calendar>
            `);

            await connect();

            const weekdays = (element as Calendar).getLocaleWeekDays();
            expect(weekdays[1]).to.equal("Mon");
        });

        it("Should return Monday weekday for long format", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="1" year="2021" weekdayFormat="long"></fast-calendar>
            `);

            await connect();

            const weekdays = (element as Calendar).getLocaleWeekDays();
            expect(weekdays[1]).to.equal("Monday");
        });

        it("Should return M for Monday for narrow format", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="1" year="2021" weekdayFormat="narrow"></fast-calendar>
            `);

            await connect();

            const weekdays = (element as Calendar).getLocaleWeekDays();
            expect(weekdays[1]).to.equal("M");
        });
    });

    describe("Localization", () => {
        it("Should be mai for the month May in French", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="5" year="2021" locale="fr-FR"></fast-calendar>
            `);

            await connect();

            const month = (element as Calendar).getLocaleMonth();
            expect(month).to.equal("mai");
        });

        it("Should have French weekday labels for the fr-FR market", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="5" year="2021" locale="fr-FR"></fast-calendar>
            `);

            await connect();

            const frenchWeekdays = [ "dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam." ];
            const weekdays = (element as Calendar).getLocaleWeekDays();
            const matchedDays = weekdays.filter((day, index) => day === frenchWeekdays[index]);
            expect(matchedDays.length).to.equal(7);
        });
        it("Should be 1943 for the year 2021 for the Hindu calendar", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="6" year="2021" locale="hi-IN-u-ca-indian"></fast-calendar>
            `);

            await connect();

            const year = (element as Calendar).getLocaleYear();
            expect(parseInt(year)).to.equal(1943);
        });

        it("Should be 2564 for the year 2021 for the buddhist calendar", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar month="6" year="2021" locale="th-TH-u-ca-buddhist"></fast-calendar>
            `);

            await connect();

            const year = (element as Calendar).getLocaleYear();
            const match = year.match(/\d+/);
            expect(match && parseInt(match[0])).to.equal(2564);
        });
    });
});
