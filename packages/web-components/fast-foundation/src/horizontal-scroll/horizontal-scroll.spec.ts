import { css, Updates } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTHorizontalScroll, horizontalScrollTemplate } from "./index.js";

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

const scrollName = uniqueElementName();
FASTHorizontalScroll.define({
    name: scrollName,
    template: horizontalScrollTemplate(),
    styles
});

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

/**
 * Calls a scroll into view and checks that the item is inside the viewport
 * @param element - HorizontalScroll element
 * @param item - item to scroll into view, element or it's index
 * @param padding - amount of padding, defaults to 0
 * @param paddingRight - optional right padding to override padding on both sides
 */
const scrollIntoViewTest = async (
    element: FASTHorizontalScroll & HTMLElement,
    item: HTMLElement | number,
    padding: number = 0,
    paddingRight?: number
) => {
    element.scrollInView(item, padding, paddingRight);

    await Updates.next()
    const {offsetLeft, offsetWidth} = typeof item === "number" ? element.scrollItems[item] : item;
    const xPosition = getXPosition(element) ?? 0;
    expect(offsetLeft - xPosition).to.greaterThanOrEqual(padding);
    expect(xPosition + element.offsetWidth - offsetLeft - offsetWidth).to.greaterThanOrEqual(paddingRight ?? padding);
}

async function setup(options: {
    width?: number
} = {}) {
    const { element, connect, disconnect }:
        {
            element: FASTHorizontalScroll;
            connect: () => void;
            disconnect: () => void;
        } = await fixture<FASTHorizontalScroll>(scrollName);

    // Removing animated scroll so that tests don't have to wait on DOM updates
    element.speed = 0;

    element.setAttribute("style", `width: ${options && options.width ? options.width : horizontalScrollWidth}px;`);
    element.innerHTML = getCards(8);

    await connect();
    await Updates.next();

    return { element, disconnect };
}

describe("HorizontalScroll", () => {
    describe("Flippers", () => {
        it("should enable the next flipper when content exceeds horizontal-scroll width", async () => {
            const { element, disconnect } = await setup();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the next flipper if content is less than horizontal-scroll width", async () => {
            const { element, disconnect } = await setup();

            element.innerHTML = cardTemplate;
            await Updates.next();

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
            await Updates.next();
            await Updates.next();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(false);
            await disconnect();
        });

        it("should disable the previous flipper when scrolled back to the beginning", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await Updates.next();

            element.scrollToPrevious();
            await Updates.next();
            await Updates.next();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);
            await disconnect();
        });

        it("should disable the next flipper when it reaches the end of the content", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();
            await Updates.next();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);
            await disconnect();
        });

        it("should re-enable the next flipper when its scrolled back from the end", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();

            element.scrollToPrevious();
            await Updates.next();
            await Updates.next();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the next flipper when it's scrolled back from the end and scrolled forward", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();

            element.scrollToNext();
            await Updates.next();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            element.scrollToPrevious();
            await Updates.next();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            element.scrollToNext();
            await Updates.next();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        })
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
            await Updates.next();

            const position: number = getXPosition(element) || 0;

            expect(position + cardSpace).to.lessThan(horizontalScrollWidth);
            expect(position + cardSpace * 2).to.gte(horizontalScrollWidth);

            await disconnect();
        });

        it("should not scroll past the beginning", async () => {
            const { element, disconnect } = await setup();

            element.scrollToPrevious();
            await Updates.next();

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

            await Updates.next();

            const cardViewWidth: number = cardSpace * 5 * -1;
            const scrollPosition: number | null = getXPosition(element);

            expect(scrollPosition).to.not.null;
            expect(scrollPosition).to.gte(cardViewWidth);

            await disconnect();
        });

        it("should change scroll stop on resize", async () => {
            const { element, disconnect } = await setup();

            element.scrollToNext();
            await Updates.next();

            const firstXPos: number | null = getXPosition(element);
            element.scrollToPrevious();

            element.style.width = `${horizontalScrollWidth * 2}px`;
            element.scrollToNext();
            await Updates.next();

            const secondXPos: number | null = getXPosition(element);

            expect(firstXPos).to.not.equal(secondXPos);

            await disconnect();
        });

        it("should scroll to previous when only 2 items wide", async () => {
            const { element, disconnect } = await setup({width: cardSpace * 2});

            element.scrollToNext();

            await Updates.next();

            const firstXPos: number | null = getXPosition(element);
            expect(firstXPos).to.not.null;
            expect(firstXPos).to.gte(cardSpace);

            element.scrollToPrevious();

            await Updates.next();

            const secondXPosition: number | null = getXPosition(element);
            expect(secondXPosition).to.equal(0);

            await disconnect();
        });

        it("should scroll item into view when using scrollInView()", async () => {
            const { element, disconnect } = await setup();
            const testScroll = scrollIntoViewTest.bind(this, element);

            await testScroll(element.scrollItems[element.scrollItems.length - 1]);
            await testScroll(element.scrollItems[0])

            await disconnect();
        });

        it("Should scroll item into view with scrollInView() by index", async () => {
            const { element, disconnect } = await setup();
            const testScroll = scrollIntoViewTest.bind(this, element);

            await testScroll(element.scrollItems.length - 1);
            await testScroll(0);

            await disconnect();
        });

        it("Should scroll item into view respecting right and left padding", async () => {
            const { element, disconnect } = await setup();
            const testScroll = scrollIntoViewTest.bind(this, element, element.scrollItems.length - 4);

            await testScroll();
            const position1 = getXPosition(element);

            await testScroll(80);
            const position2 = getXPosition(element);
            expect(position1).to.not.equal(position2);

            await testScroll(0, 200);
            const position3 = getXPosition(element);
            expect(position2).to.not.equal(position3);

            await scrollIntoViewTest(element, 2, 20);

            await disconnect();
        });

        it("Should not scroll with scrollInView() when the item is in view", async () => {
            const { element, disconnect } = await setup();
            element.scrollInView(2);

            await Updates.next();
            expect(getXPosition(element)).to.equal(0);

            await disconnect();
        });
    });
});
