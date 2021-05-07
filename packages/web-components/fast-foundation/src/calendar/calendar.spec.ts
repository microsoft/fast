import { css, customElement, DOM, FASTElement, html } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../fixture";
import { Calendar, CalendarTemplate as template } from "./index";

/**
 * Basic styles needed to render a calendar
 */
const styles = css`
`;

/**
 * initialization of the custome <fast-calendar/> element
 */
@customElement({
    name: "fast-calendar",
    template,
    styles
})
class FASTCalendar extends Calendar {}

describe("Calendar", () => {

    describe("", () => {
        it("Should default to the current month and year", async () => {
            const { element, connect, disconnect } = await fixture(html<FASTCalendar>`
                <fast-calendar></fast-calendar>
            `);

            const today = new Date();

            await connect();
            await DOM.nextUpdate();

            expect((element as FASTCalendar).month === today.getMonth() + 1);
            expect((element as FASTCalendar).year === today.getFullYear());

            await disconnect();
        });
    })
});
