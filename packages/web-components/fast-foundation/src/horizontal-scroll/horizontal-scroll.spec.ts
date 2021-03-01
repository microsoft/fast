import { customElement, DOM } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../fixture";
import { html } from "@microsoft/fast-element";
import { HorizontalScroll, HorizontalScrollTemplate as template, HorizontalScrollStyles as styles } from "./index";

@customElement({
    name: "fast-horizontal-scroll",
    template,
    styles
})
class FASTHorizontalScroll extends HorizontalScroll {}

/**
 * Static widths for calculating expected returns
 */
const horizontalScrollWidth: number = 400;
const cardWidth: number = 100;
const cardMargin: number = 10;
const cardSpace: number = cardWidth + (cardMargin * 2);

/**
 * Function for getting the x-position of an element
 */
const getXPosition = (elm: HTMLElement | null | undefined): number | null => {
    if (!elm) return null;
    const { transform } = elm.style;
    const pattern = /^ *translate3d *\( *(\-?\d+)/i;
    const match = transform.match(pattern);
    return match ? parseInt(match[1]) : null;
}

/**
 * Templates used for content
 */
const cardTemplate: string = `<div class="card" style="width: ${cardWidth}px; height: 100px; margin: ${cardMargin}px;"></div>`;

/**
 * Multi card templates
 * @param cnt number of cards
 */
const getCards = (cnt: number): string => new Array(cnt).fill(cardTemplate).reduce((s, c) => s += c, '');

describe("HorinzontalScroll", () => {
    it("should include a role of horizontal-scroll", async () => {
        const { element, connect, disconnect } = await fixture<FASTHorizontalScroll>("fast-horizontal-scroll");

        await connect();

        expect(element.getAttribute("role")).to.equal("horizontal-scroll");

        await disconnect();
    });

    describe("Flippers", () => {
        it("should enable the next flipper when content exceeds horizontal-scroll width", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${getCards(5)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the next flipper if content is less than horizontal-scroll width", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should disable the previous flipper by default", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`<fast-horizontal-scroll></fast-horizontal-scroll>`);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should enable the previous flipper when content is scrolled", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${getCards(5)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            await element.scrollToNext();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the previous flipper when scrolled back to the beginning", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            await element.scrollToNext();
            await element.scrollToPrevious();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should disable the next flipper when it reaches the end of the content", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            await element.scrollToNext();
            await element.scrollToNext();
            await element.scrollToNext();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should re-enable the next flipper when its scrolled back from the end", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            await element.scrollToNext();
            await element.scrollToNext();
            await element.scrollToPrevious();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

    });

    describe("Scrolling", () => {
        it("should start in the 0 position", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            const scrollContent: HTMLElement | null | undefined = element.shadowRoot?.querySelector(".content-container");

            expect(getXPosition(scrollContent)).to.equal(0);

            await disconnect();
        });

        it("should scroll to the beginning of the last element in full view", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            await element.scrollToNext();

            const scrollContent: HTMLElement | null | undefined = element.shadowRoot?.querySelector(".content-container");
            const position: number = getXPosition(scrollContent) || 0;
            const currentInView: boolean = (position + cardSpace) * -1 < horizontalScrollWidth;
            const nextInView: boolean = (position - cardSpace * 2) * -1 < horizontalScrollWidth;

            expect(currentInView && !nextInView).to.equal(true);

            await disconnect();
        });

        it("should not scroll past the beginning", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            await element.scrollToPrevious();

            const scrollContent: HTMLElement | null | undefined = element.shadowRoot?.querySelector(".content-container");
            const scrollPosition: number | null = getXPosition(scrollContent);

            expect(scrollPosition !== null && scrollPosition >= 0).to.equal(true);

            await disconnect();
        });

        it("should not scroll past the last in view element", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            await element.scrollToNext();
            await element.scrollToNext();
            await element.scrollToNext();
            await element.scrollToNext();
            await element.scrollToNext();
            await element.scrollToNext();

            const scrollContent: HTMLElement | null | undefined = element.shadowRoot?.querySelector(".content-container");
            let cardViewWidth: number = cardSpace * 5 * -1;
            const scrollPosition: number | null = getXPosition(scrollContent);

            expect(scrollPosition !== null && scrollPosition > cardViewWidth).to.equal(true);

            await disconnect();
        });

        it("should move to start on resize", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            await element.scrollToNext();

            element.style.width = `${horizontalScrollWidth * 2}px`;
            await DOM.nextUpdate();

            const scrollContent: any = element.shadowRoot?.querySelector(".content-container");

            expect(getXPosition(scrollContent)).to.equal(0);

            await disconnect();
        });

        
        it("should change scroll stop on resize", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth * 2}px">
                    ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate} ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            const scrollContent: any = element.shadowRoot?.querySelector(".content-container");

            await element.scrollToNext();
            const firstXPos: number | null = getXPosition(scrollContent);

            element.style.width = `${horizontalScrollWidth}px`;
            await DOM.nextUpdate();
            await element.scrollToNext();
            const secondXPos: number | null = getXPosition(scrollContent);


            expect(firstXPos === secondXPos).to.equal(false);

            await disconnect();
        });

    });
});
