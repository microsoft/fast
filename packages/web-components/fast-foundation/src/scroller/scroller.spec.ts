import { customElement, DOM } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../fixture";
import { html } from "@microsoft/fast-element";
import { Scroller, ScrollerTemplate as template, ScrollerStyles as styles } from "./index";

@customElement({
    name: "fast-scroller",
    template,
    styles
})
class FASTScroller extends Scroller {}

/**
 * Static widths for calculating expected returns
 */
const scrollerWidth = 400;
const cardWidth = 100;
const cardMargin = 10;
const cardSpace = cardWidth + (cardMargin * 2);

/**
 * Function for getting the x-position of an element
 */
const getXPosition = (elm: any) => {
    const { transform } = elm.style;
    const pattern = /^ *translate3d *\( *(\-?\d+)/i;
    const match = transform.match(pattern);
    return parseInt(match[1]);
}

/**
 * Templates used for content
 */
const cardTemplate = `<div class="card" style="width: ${cardWidth}px; height: 100px; margin: ${cardMargin}px;"></div>`;

const getCards = (cnt) => new Array(cnt).fill(cardTemplate).reduce((s, c) => s += c, '');

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTScroller>(
        "fast-scroller"
    );

    return { element, connect, disconnect, parent };
}

describe("Scroller", () => {
    it("should include a role of scroller", async () => {
        const { element, connect, disconnect } = await fixture<Scroller>("fast-scroller");

        await connect();

        expect(element.getAttribute("role")).to.equal("scroller");

        await disconnect();
    });

    describe("Flippers", () => {

        it("should enable the next flipper when content exceeds scroller width", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${getCards(5)}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the next flipper if content is less than scroller width", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should disable the previous flipper by default", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`<fast-scroller></fast-scroller>`);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should enable the previous flipper when content is scrolled", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${getCards(5)}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the previous flipper when scrolled back to the beginning", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToPrevious();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should disable the next flipper when it reaches the end of the content", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should re-enable the next flipper when its scrolled back from the end", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToPrevious();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

    });

    describe("Scrolling", () => {

        it("should start in the 0 position", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();

            const scrollContent = element.shadowRoot?.querySelector(".scroll-content") as any;

            expect(getXPosition(scrollContent)).to.equal(0);

            await disconnect();
        });

        it("should scroll to the beginning of the last element in full view", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();

            const scrollContent = element.shadowRoot?.querySelector(".scroll-content") as any;
            const pos = getXPosition(scrollContent);

            expect(pos * -1 < scrollerWidth && (pos - (cardSpace * 2)) * -1 > scrollerWidth).to.equal(true);

            await disconnect();
        });

        it("should not scroll past the beginning", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToPrevious();

            const scrollContent = element.shadowRoot?.querySelector(".scroll-content") as any;

            expect(getXPosition(scrollContent)).to.equal(0);

            await disconnect();
        });

        it("should not scroll past the last in view element", async () => {
            let cardViewWidth = cardSpace * 5 * -1;
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();
            await (element as FASTScroller).scrollToNext();

            const scrollContent = element.shadowRoot?.querySelector(".scroll-content") as any;

            expect(getXPosition(scrollContent) > cardViewWidth).to.equal(true);

            await disconnect();
        });

        it("should move to start on resize", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();

            element.style.width = `${scrollerWidth * 2}px`;
            await DOM.nextUpdate();

            const scrollContent = element.shadowRoot?.querySelector(".scroll-content") as any;

            expect(getXPosition(scrollContent)).to.equal(0);

            await disconnect();
        });

        
        it("should change scroll stop on resize", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTScroller>`
                <fast-scroller style="width: ${scrollerWidth * 2}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-scroller>
            `);
            await connect();
            await DOM.nextUpdate();
            const scrollContent = element.shadowRoot?.querySelector(".scroll-content") as any;

            await (element as FASTScroller).scrollToNext();
            const firstXPos = getXPosition(scrollContent);

            element.style.width = `${scrollerWidth}px`;
            await DOM.nextUpdate();
            await (element as FASTScroller).scrollToNext();
            const secondXPos = getXPosition(scrollContent);


            expect(firstXPos === secondXPos).to.equal(false);

            await disconnect();
        });

    });
});