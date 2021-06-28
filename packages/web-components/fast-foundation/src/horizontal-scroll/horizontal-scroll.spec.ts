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
    const { element, connect, disconnect } = await fixture(FASTHorizontalScroll());


    return { element, connect, disconnect };
}

describe("HorinzontalScroll", () => {
    describe("Flippers", () => {
        it("should enable the next flipper when content exceeds horizontal-scroll width", async () => {
            const { element, connect, disconnect } = await setup();

            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

            await disconnect();
        });

        it("should disable the next flipper if content is less than horizontal-scroll width", async () => {
            const { element, connect, disconnect } = await setup();

            element.setAttribute("style", "width: 800px");
            element.innerHTML = cardTemplate;

            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should disable the previous flipper by default", async () => {
            const { element, connect, disconnect} = await setup();

            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();

            expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true);

            await disconnect();
        });

        it("should enable the previous flipper when content is scrolled", async () => {
            const { element, connect, disconnect } = await setup();

            element.speed = -1;
            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();

            element.scrollToNext();

            await setTimeout(async () => {
                expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(false);
                await disconnect();
            }, 1);
        });

        it("should disable the previous flipper when scrolled back to the beginning", async () => {
            const { element, connect, disconnect } = await setup();

            element.speed = -1;
            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();

            element.scrollToNext();
            element.scrollToPrevious();

            await setTimeout(async () => {
                await setTimeout(() => expect(element.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")).to.equal(true), 10);
                await disconnect();
            }, 1);
        });

        it("should disable the next flipper when it reaches the end of the content", async () => {
            const { element, connect, disconnect } = await setup();

            element.speed = -1;
            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(5);

            await connect();
            await DOM.nextUpdate();

            element.scrollToNext();
            element.scrollToNext();
            await DOM.nextUpdate();

            await setTimeout(async () => {
                expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(45)
                await disconnect();
            }, 1);
        });

        it("should re-enable the next flipper when its scrolled back from the end", async () => {
            const { element, connect, disconnect } = await setup();

            element.speed = -1;
            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToPrevious();


            await setTimeout(async () => {
                expect(element.shadowRoot?.querySelector(".scroll-next")?.classList.contains("disabled")).to.equal(false);

                await disconnect();
            }, 1);
        });
    });

    describe("Scrolling", () => {
        it("should start in the 0 position", async () => {
            const { element, connect, disconnect } = await setup();

            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();

            expect(getXPosition(element)).to.equal(0);

            await disconnect();
        });

        it("should scroll to the beginning of the last element in full view", async () => {
            const { element, connect, disconnect } = await setup();

            element.speed = -1;
            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();
            element.scrollToNext();

            await setTimeout(async () => {
                const position: number = getXPosition(element) || 0;
                const cardsFit = (horizontalScrollWidth - horizontalScrollWidth % cardSpace) / cardSpace;
                const cardStart = cardSpace * (cardsFit - 1);
                const currentInView: boolean = (position + cardSpace) < horizontalScrollWidth;
                const nextInView: boolean = (position - cardSpace * 2) < horizontalScrollWidth;

                expect(currentInView && !nextInView).to.equal(true);

                await disconnect();
            }, 1);
        });

        it("should not scroll past the beginning", async () => {
            const { element, connect, disconnect } = await setup();

            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();
            element.scrollToPrevious();

            await setTimeout(async () => {
                const scrollPosition: number | null = getXPosition(element);

                expect(scrollPosition !== null && scrollPosition >= 0).to.equal(true);

                await disconnect();
            }, 1);
        });

        it("should not scroll past the last in view element", async () => {
            const { element, connect, disconnect } = await setup();

            element.setAttribute("style", `width: ${horizontalScrollWidth}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();

            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();
            element.scrollToNext();

            await setTimeout(async () => {
                let cardViewWidth: number = cardSpace * 5 * -1;
                const scrollPosition: number | null = getXPosition(element);

                expect(scrollPosition !== null && scrollPosition > cardViewWidth).to.equal(true);

                await disconnect();
            }, 1);
        });
        
        it("should change scroll stop on resize", async () => {
            const { element, connect, disconnect } = await setup();

            element.speed = -1;
            element.setAttribute("style", `width: ${horizontalScrollWidth * 2}px}`);
            element.innerHTML = getCards(8);

            await connect();
            await DOM.nextUpdate();

            element.scrollToNext();
            await setTimeout(async () => {
                const firstXPos: number | null = getXPosition(scrollContent);
                element.scrollToPrevious();

                element.style.width = `${horizontalScrollWidth}px`;
                element.scrollToNext();

                await setTimeout(async () => {
                    const secondXPos: number | null = getXPosition(scrollContent);

                    expect(firstXPos === secondXPos).to.equal(false);

                    await disconnect();
                }, 1);
            }, 1);
        });

    });
});
