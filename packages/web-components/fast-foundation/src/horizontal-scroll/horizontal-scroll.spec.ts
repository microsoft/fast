import { css, DOM, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { HorizontalScroll, horizontalScrollTemplate as template } from "./index";

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

const FASTHorizontalScroll = HorizontalScroll.compose({
    baseName: "horizontal-scroll",
    template,
    styles
})

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

    return elm.shadowRoot?.querySelector(".scroll-view")?.scrollLeft;
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

async function setup() {
    const { element, connect, disconnect }:
        {
            element: HorizontalScroll & HTMLElement,
            connect: () => void,
            disconnect: () => void
        } = await fixture(FASTHorizontalScroll());

    // Removing animated scroll so that tests don't have to wait on DOM updates
    element.speed = 0;

    element.setAttribute("style", `width: ${horizontalScrollWidth}px;`);
    element.innerHTML = getCards(8);

    await connect();
    await DOM.nextUpdate();

    return { element, disconnect };
}

describe("HorinzontalScroll", () => {
    describe("Flippers", () => {
        it("should enable the next flipper when content exceeds horizontal-scroll width", async () => {
            const { element, disconnect } = await setup();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the next flipper if content is less than horizontal-scroll width", async () => {
            const { element, disconnect } = await setup();

            element.innerHTML = cardTemplate;
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should disable the previous flipper by default", async () => {
            const { element, disconnect} = await setup();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should enable the previous flipper when content is scrolled", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await DOM.nextUpdate();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(false);
            await disconnect();
        });

        it("should disable the previous flipper when scrolled back to the beginning", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToPrevious();
            await DOM.nextUpdate();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);
            await disconnect();
        });

        it("should disable the next flipper when it reaches the end of the content", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToNext();
            await DOM.nextUpdate();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);
            await disconnect();
        });

        it("should re-enable the next flipper when its scrolled back from the end", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToNext();
            await DOM.nextUpdate();

            element.scrollToPrevious();
            await DOM.nextUpdate();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });
    });

    describe("Scrolling", () => {
        it("should start in the 0 position", async () => {
            const { element, disconnect } = await setup();

            expect(getXPosition(element)).to.equal(0);

            await disconnect();
        });

        it("should scroll to the beginning of the last element in full view", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await DOM.nextUpdate();

            const position: number = getXPosition(element) || 0;

            expect(position + cardSpace).to.lessThan(horizontalScrollWidth);
            expect(position + cardSpace * 2).to.gte(horizontalScrollWidth);

            await disconnect();
        });

        it("should not scroll past the beginning", async () => {
            const { element, disconnect } = await setup();

            element.scrollToPrevious();
            await DOM.nextUpdate();

            const scrollPosition: number | null = getXPosition(element);

            expect(scrollPosition).to.not.null;
            expect(scrollPosition).to.gte(0);

            await disconnect();
        });

        it("should not scroll past the last in view element", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();

            await DOM.nextUpdate();

            let cardViewWidth: number = cardSpace * 5 * -1;
            const scrollPosition: number | null = getXPosition(element);

            expect(scrollPosition).to.not.null;
            expect(scrollPosition).to.gte(cardViewWidth);

            await disconnect();
        });

        it("should change scroll stop on resize", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await DOM.nextUpdate();

            const firstXPos: number | null = getXPosition(element);
            element.scrollToPrevious();

            element.style.width = `${horizontalScrollWidth * 2}px`;
            element.scrollToNext();
            await DOM.nextUpdate();

            const secondXPos: number | null = getXPosition(element);

            expect(firstXPos).to.not.equal(secondXPos);

            await disconnect();
        });

    });
});
