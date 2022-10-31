import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { fixtureURL } from "../__test__/helpers.js";
import type { FASTCalendar } from "./calendar.js";
import { DateFormatter } from "./date-formatter.js";

test.describe("Calendar", () => {
    let page: Page;
    let element: Locator;
    let root: Locator;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

        element = page.locator("fast-calendar");

        root = page.locator("#root");

        await page.goto(fixtureURL("calendar--calendar"));
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.describe("DateFormatter", () => {
        test("should be able to set properties on construction", async () => {
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
                date,
            });

            expect(formatter.locale).toBe(locale);
            expect(formatter.dayFormat).toBe(dayFormat);
            expect(formatter.monthFormat).toBe(monthFormat);
            expect(formatter.yearFormat).toBe(yearFormat);
            expect(formatter.weekdayFormat).toBe(weekdayFormat);
            expect(formatter.date.getDate()).toBe(1);
            expect(formatter.date.getMonth()).toBe(0);
            expect(formatter.date.getFullYear()).toBe(2021);
        });

        test("should return a date string for today by default", async () => {
            const formatter = new DateFormatter();
            const today = new Date();

            expect(formatter.getDate()).toBe(formatter.getDate(today));
        });

        test("should be able to get a date string for a specific date", async () => {
            const formatter = new DateFormatter();
            const day = 2;
            const month = 1;
            const year = 2020;
            const dateString = `${month}/${day}/${year}`;
            const date = new Date(year, month - 1, day);

            expect(
                formatter.getDate(date, {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                })
            ).toBe(dateString);
        });

        test("should default formatting to [weekday='long'], [month='long'] [day='numeric'], [year='numeric'] string", async () => {
            const formatter = new DateFormatter({ date: "1-1-2020" });

            expect(formatter.getDate()).toBe("Wednesday, January 1, 2020");
        });

        test("should be able to change formats", async () => {
            const formatter = new DateFormatter({
                weekdayFormat: undefined,
                monthFormat: "short",
                date: new Date(2020, 0, 1),
            });

            expect(formatter.getDate()).toBe("Jan 1, 2020");

            formatter.dayFormat = "2-digit";

            expect(formatter.getDate()).toBe("Jan 01, 2020");
            expect(
                formatter.getDate("1-1-2020", {
                    month: "narrow",
                    day: "2-digit",
                    year: "2-digit",
                })
            ).toBe("J 01, 20");
        });

        test("should return todays day by default for getDay()", async () => {
            const formatter = new DateFormatter();
            const today = new Date();

            expect(formatter.getDay()).toBe(today.getDate().toString());
        });

        test("should return formatted days with getDay()", async () => {
            const formatter = new DateFormatter();

            expect(formatter.getDay(14)).toBe("14");
            expect(formatter.getDay(8, "2-digit")).toBe("08");
        });

        test("should return this month by default for getMonth()", async () => {
            const formatter = new DateFormatter();
            const today = new Date();
            const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            expect(formatter.getMonth()).toBe(months[today.getMonth()]);
        });

        test("should return formatted month with getMonth()", async () => {
            const formatter = new DateFormatter();

            expect(formatter.getMonth(1)).toBe("January");
            expect(formatter.getMonth(2, "short")).toBe("Feb");
            expect(formatter.getMonth(3, "narrow")).toBe("M");
            expect(formatter.getMonth(4, "numeric")).toBe("4");
            expect(formatter.getMonth(5, "2-digit")).toBe("05");
        });

        test("should return this year by default for getYear()", async () => {
            const formatter = new DateFormatter();
            const today = new Date();

            expect(formatter.getYear()).toBe(today.getFullYear().toString());
        });

        test("should return formatted year with getYear()", async () => {
            const formatter = new DateFormatter({ yearFormat: "2-digit" });

            expect(formatter.getYear(2012)).toBe("12");
            expect(formatter.getYear(2015, "numeric")).toBe("2015");
        });

        test("should return formatted weekday string with getWeekday()", async () => {
            const formatter = new DateFormatter();

            //defaults to sunday
            expect(formatter.getWeekday()).toBe("Sunday");
            expect(formatter.getWeekday(2)).toBe("Tuesday");
            expect(formatter.getWeekday(3, "short")).toBe("Wed");
            expect(formatter.getWeekday(4, "narrow")).toBe("T");
        });

        test("should return a list of formatted weekday labels with getWeekdays()", async () => {
            const formatter = new DateFormatter();
            const weekdays = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];
            const weekdaysShort = weekdays.map(day => day.substr(0, 3));
            const weekdaysNarrow = weekdays.map(day => day.substr(0, 1));

            expect(formatter.getWeekdays().toString()).toBe(weekdays.toString());
            expect(formatter.getWeekdays("short").toString()).toBe(
                weekdaysShort.toString()
            );
            expect(formatter.getWeekdays("narrow").toString()).toBe(
                weekdaysNarrow.toString()
            );
        });

        test("should return a localized string when setting the locale", async () => {
            const formatter = new DateFormatter({ locale: "fr-FR", date: "3-1-2015" });

            expect(formatter.getDate()).toBe("dimanche 1 mars 2015");
            expect(formatter.getWeekday(0)).toBe("dimanche");
            expect(formatter.getMonth(3)).toBe("mars");
            formatter.locale = "de-DE";
            expect(formatter.getDate()).toBe("Sonntag, 1. März 2015");
            expect(formatter.getWeekday(0)).toBe("Sonntag");
            expect(formatter.getMonth(3)).toBe("März");
        });
    });

    test.describe("Defaults", () => {
        test("should default to the current month and year", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar></fast-calendar>
                `;
            });

            const today = new Date();

            await expect(element).toHaveJSProperty("month", today.getMonth() + 1);
            await expect(element).toHaveJSProperty("year", today.getFullYear());
        });

        test("should return 5 weeks of days for August 2021", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="8" year="2021"></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) => {
                    return node.getDays();
                })
            ).toHaveLength(5);

            const week = element.locator(`[part="week"]`);
            const day = element.locator(`[part="day"]`);

            await expect(week).toHaveCount(5);
            await expect(day).toHaveCount(35);
        });

        test("should return 6 weeks of days for August 2021 when min-weeks is set to 6", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="8" year="2021" min-weeks="6"></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) => {
                    return node.getDays();
                })
            ).toHaveLength(6);

            const week = element.locator(`[part="week"]`);
            const day = element.locator(`[part="day"]`);

            await expect(week).toHaveCount(6);
            await expect(day).toHaveCount(42);
        });

        test("should highlight the current date", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar></fast-calendar>
                `;
            });

            const today = element.locator(`[part="today"]`);

            await expect(today).toHaveCount(1);

            await expect(today).toHaveText(new Date().getDate().toString());
        });
    });

    test.describe("Month info", () => {
        test("should display 31 days for the month of January in the year 2022", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2022" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) => node.getMonthInfo().length)
            ).toBe(31);

            const days = page.locator("[part='day']:not(.inactive)");

            await expect(days).toHaveCount(31);
        });

        test("should display 28 days for the month of February in the year 2022", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="2" year="2022" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) => node.getMonthInfo().length)
            ).toBe(28);

            const days = page.locator("[part='day']:not(.inactive)");

            await expect(days).toHaveCount(28);
        });

        test("should display 29 days for the month of February in the year 2020", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="2" year="2020" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) => node.getMonthInfo().length)
            ).toBe(29);

            const days = page.locator("[part='day']:not(.inactive)");

            await expect(days).toHaveCount(29);
        });

        test("should start on Friday for January 2021", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) => node.getMonthInfo().start)
            ).toBe(5);

            const days = element.locator(".date");

            await expect(days.nth(5)).toHaveText("1");
        });

        test("should start on Monday for February 2021", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="2" year="2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) => node.getMonthInfo().start)
            ).toBe(1);

            const days = element.locator(".date");

            await expect(days.nth(1)).toHaveText("1");
        });
    });

    test.describe("Labels", async () => {
        test("should return January for month 1", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getMonth(node.month)
                )
            ).toBe("January");
        });

        test("should return Jan for month 1 and short format", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" month-format="short" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getMonth(node.month)
                )
            ).toBe("Jan");
        });

        test("should return Mon for Monday by default", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getWeekday(1)
                )
            ).toBe("Mon");
        });

        test("should return Monday weekday for long format", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" weekday-format="long" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getWeekday(1)
                )
            ).toBe("Monday");
        });

        test("should return M for Monday for narrow format", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" weekday-format="narrow" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getWeekday(1)
                )
            ).toBe("M");
        });
    });

    test.describe("Localization", async () => {
        test(`should be "mai" for the month May in French`, async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="5" year="2021" locale="fr" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getMonth(node.month)
                )
            ).toBe("mai");
        });

        test("should have French weekday labels for the fr-FR market", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" locale="fr-FR" readonly></fast-calendar>
                `;
            });

            const frenchWeekdays = [
                "dim.",
                "lun.",
                "mar.",
                "mer.",
                "jeu.",
                "ven.",
                "sam.",
            ];

            const weekdayLabels = element.locator(".week-day");

            await expect(weekdayLabels).toHaveText(frenchWeekdays);
        });

        test('should set the formatted `year` property to "1942" when the `year` attribute is "2021" for the Hindu calendar', async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="6" year="2021" locale="hi-IN-u-ca-indian"></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getYear(node.year)
                )
            ).toBe("1942 शक");
        });

        test('should set the formatted `year` property to "2564" when the `year` attribute is "2021" for the Buddhist calendar', async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="6" year="2021" locale="th-TH-u-ca-buddhist"></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateFormatter.getYear(node.year)
                )
            ).toBe("พ.ศ. 2564");
        });

        test("should not be RTL for languages that are not Arabic or Hebrew", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="1" year="2021" locale="fr-FR" readonly></fast-calendar>
                `;
            });

            await expect(element).not.toHaveAttribute("dir", "rtl");

            const dates = element.locator(".day:not(.inactive)");

            const dateStrings = await dates.evaluateAll((nodes: HTMLElement[]) =>
                nodes.map(node => parseInt(node.textContent ?? "", 10))
            );

            for (let i = 0; i < dateStrings.length - 1; i++) {
                expect(dateStrings[i]).toBeLessThan(dateStrings[i + 1]);
            }
        });

        /* FIXME this test is an incorrect assertion */
        test.skip("Should be RTL for Arabic language", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="8" year="2021" locale="ar-XE-u-ca-islamic-nu-arab" readonly></fast-calendar>
                `;
            });

            const date = element.locator(".date");

            const dateStrings = await date.evaluateAll((nodes: HTMLElement[]) =>
                nodes.map(node => node.innerHTML.trim())
            );

            expect(parseInt(dateStrings[0]) < parseInt(dateStrings[1])).toBeFalsy();
        });
    });

    test.describe("Day states", async () => {
        test("should not show date as disabled by default", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="5" year="2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateInString("5-7-2021", node.disabledDates)
                )
            ).toBe(false);

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node
                        .getDayClassNames({ month: 5, day: 7, year: 2021 })
                        .indexOf("disabled")
                )
            ).toBe(-1);

            const disabled = element.locator(".disabled");

            await expect(disabled).toHaveCount(0);
        });

        test("should show date as disabled when added to disabled-dates attribute", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="5" year="2021" disabled-dates="5-6-2021,5-7-2021,5-8-2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateInString("5-7-2021", node.disabledDates)
                )
            ).toBe(true);

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.getDayClassNames({
                        month: 5,
                        day: 7,
                        year: 2021,
                        disabled: true,
                    })
                )
            ).toContain("disabled");

            const disabled = element.locator(".disabled");

            await expect(disabled).toHaveCount(3);
        });

        test("should not show date as selected by default", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="5" year="2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateInString(`5-7-2021`, node.selectedDates)
                )
            ).toBe(false);

            expect(
                element.evaluate(
                    (node: FASTCalendar) =>
                        node
                            .getDayClassNames({ month: 5, day: 7, year: 2021 })
                            .indexOf("selected") === -1
                )
            ).toBeTruthy();

            const selected = element.locator(".selected");

            await expect(selected).toHaveCount(0);
        });

        test("should show date as selected when added to selected-dates attribute", async () => {
            await root.evaluate(node => {
                node.innerHTML = /* html */ `
                    <fast-calendar month="5" year="2021" selected-dates="5-6-2021,5-7-2021,5-8-2021" readonly></fast-calendar>
                `;
            });

            expect(
                await element.evaluate((node: FASTCalendar) =>
                    node.dateInString(`5-7-2021`, node.selectedDates)
                )
            ).toBe(true);

            expect(
                await element.evaluate(
                    (node: FASTCalendar) =>
                        node
                            .getDayClassNames({
                                month: 5,
                                day: 7,
                                year: 2021,
                                selected: true,
                            })
                            .indexOf("selected") >= 0
                )
            ).toBeTruthy();

            const selected = element.locator(".selected");

            await expect(selected).toHaveCount(3);
        });
    });
});
