import { css, customElement, DOM, FASTElement, html } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../test-utilities/fixture";
import { timeout } from "../test-utilities/timeout";
import { HorizontalScroll, HorizontalScrollTemplate as template } from "./index";

const styles = css`
    :host {
        display: block;
    }

    .content-container {
        white-space: nowrap;
        display: inline-block;
    }

    .content-container ::slotted(*) {
        display: inline-block;
        white-space: normal;
    }

    div.scroll-view {
        overflow-x: hidden;
    }
`;

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
const getXPosition = (elm: any): number | null => {
    if (!elm) return null;

    return elm.scrollLeft;
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

describe("HorizontalScroll", () => {

    it("should disable next flipper when resize bigger", async () => {
        const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
            <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                ${getCards(5)}
            </fast-horizontal-scroll>
        `);
        await connect();
        await DOM.nextUpdate();

        expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);
        
        element.style.width = "1000px";
        await timeout(element['frameTime'] + 20);

        expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

        await disconnect();
    });

    it("should enable next flipper once dynamic content is loaded", async () => {
        const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
            <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px"></fast-horizontal-scroll>
        `);

        await connect();

        element.innerHTML = getCards(8);

        await DOM.nextUpdate();

        expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);
        await disconnect();
    });

    describe("Flippers", () => {
        it("should enable the next flipper when content exceeds horizontal-scroll width", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the next flipper if content is less than horizontal-scroll width", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: 800px">
                    ${cardTemplate}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should disable the previous flipper by default", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`<fast-horizontal-scroll>${getCards(8)}</fast-horizontal-scroll>`);
            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        // TODO: https://github.com/microsoft/fast/issues/4707
        xit("should enable the previous flipper when content is scrolled", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px" speed="-1">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            element.scrollToNext();

            await timeout();
            expect(element.previousFlipper.classList.contains("disabled")).to.be.false;
            await disconnect();
        });

        it("should disable the previous flipper when scrolled back to the beginning", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px" speed="-1">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            element.scrollToNext();
            element.scrollToPrevious();

            await timeout();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);
            await disconnect();
        });

        // TODO: https://github.com/microsoft/fast/issues/4707
        xit("should disable the next flipper when it reaches the end of the content", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px" speed="-1">
                    ${getCards(5)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();

            await timeout();
            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true)

            await disconnect();
        });

        it("should re-enable the next flipper when its scrolled back from the end", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px" speed="-1">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToPrevious();


            await timeout();
            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);
            await disconnect();
        });
    });

    describe("Scrolling", () => {
        it("should start in the 0 position", async () => {
            const { element, connect, disconnect} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            expect(getXPosition(element)).to.equal(0);

            await disconnect();
        });

        // TODO: https://github.com/microsoft/fast/issues/4707
        xit("should scroll to the beginning of the last element in full view", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px" speed="-1">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            element.scrollToNext();

            await timeout();
            const position: number = getXPosition(element) || 0;
            const cardsFit = (horizontalScrollWidth - horizontalScrollWidth % cardSpace) / cardSpace;
            const cardStart = cardSpace * (cardsFit - 1);
            const currentInView: boolean = (position + cardSpace) < horizontalScrollWidth;
            const nextInView: boolean = (position - cardSpace * 2) < horizontalScrollWidth;

            expect(currentInView && !nextInView).to.equal(true);

            await disconnect();
        });

        it("should not scroll past the beginning", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            element.scrollToPrevious();

            await timeout();
            const scrollPosition: number | null = getXPosition(element);

            expect(scrollPosition !== null && scrollPosition >= 0).to.equal(true);

            await disconnect();
        });

        it("should not scroll past the last in view element", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth}px">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();

            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();

            await timeout();
            let cardViewWidth: number = cardSpace * 5 * -1;
            const scrollPosition: number | null = getXPosition(element);

            expect(scrollPosition !== null && scrollPosition > cardViewWidth).to.equal(true);

            await disconnect();
        });
        
        // TODO: https://github.com/microsoft/fast/issues/4707
        xit("should change scroll stop on resize", async () => {
            const { element, connect, disconnect }: { element: FASTHorizontalScroll, connect: () => Promise<void>, disconnect: () => Promise<void>} = await fixture(html<FASTHorizontalScroll>`
                <fast-horizontal-scroll style="width: ${horizontalScrollWidth * 2}px" speed="-1">
                    ${getCards(8)}
                </fast-horizontal-scroll>
            `);
            await connect();
            await DOM.nextUpdate();
            const scrollContent: any = element.shadowRoot?.querySelector(".content-container");

            element.scrollToNext();
            await timeout();
            const firstXPos: number | null = getXPosition(scrollContent);
            element.scrollToPrevious();

            element.style.width = `${horizontalScrollWidth}px`;
            element.scrollToNext();

            await timeout();
            const secondXPos: number | null = getXPosition(scrollContent);

            expect(firstXPos === secondXPos).to.equal(false);

            await disconnect();
        });

    });
});
