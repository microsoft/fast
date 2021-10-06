import type { HorizontalScroll as HorizontalScrollType } from "@microsoft/fast-foundation";
import { assert, expect } from "chai";
import { ElementHandle } from "playwright";

type fastHorizontalScroll = HTMLElement & HorizontalScrollType;

describe("FASTHorizontalScroll", function () {
    const cardCount = 16;
    const cardHeight = 200;
    const cardWidth = 120;
    const horizontalScrollWidth = 400;
    const scrollItemSpacing = 5;
    const allCardsWidth = cardCount * (cardWidth + scrollItemSpacing);
    const maxScrolls = allCardsWidth / horizontalScrollWidth;
    const cardsPerScreen = Math.floor(cardCount / maxScrolls) - 1;

    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        await this.page.evaluateHandle(
            ({
                cardCount,
                cardHeight,
                cardWidth,
                horizontalScrollWidth,
                scrollItemSpacing,
            }) => {
                const element = document.createElement(
                    "fast-horizontal-scroll"
                ) as fastHorizontalScroll;

                element.style.setProperty("width", `${horizontalScrollWidth}px`);
                element.style.setProperty(
                    "--scroll-item-spacing",
                    `${scrollItemSpacing}px`
                );

                for (let i = 0; i <= cardCount; i++) {
                    const card = document.createElement("div");
                    card.innerText = `card ${i}`;
                    card.style.setProperty("height", `${cardHeight}px`);
                    card.style.setProperty("width", `${cardWidth}px`);
                    element.appendChild(card);
                }

                element.id = "HorizontalScroll1";

                document.body.appendChild(element);

                return element;
            },
            {
                cardCount,
                cardHeight,
                cardWidth,
                horizontalScrollWidth,
                scrollItemSpacing,
            }
        );
    });

    afterEach(async function () {
        if (this.setupHandle) {
            await this.setupHandle.dispose();
        }
    });

    // fastHorizontalScroll should render on the page
    it("should render on the page", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        expect(element).to.exist;
    });

    it("should start in the 0 position", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            0
        );
    });

    it("should scroll to the beginning of the last element in full view", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
            node.speed = 0;
            node.scrollToNext();
        });

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            cardsPerScreen * (cardWidth + scrollItemSpacing)
        );
    });

    it("should not scroll past the beginning", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        assert((await element.evaluate(node => node.scrollContainer.scrollLeft)) === 0);

        await element.evaluateHandle(node => {
            node.speed = 0;

            node.scrollToPrevious();
        });

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            0
        );
    });

    it("should not scroll past the last in-view element", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
            node.speed = 0;

            node.scrollContainer.scrollLeft =
                node.scrollContainer.scrollWidth - node.scrollContainer.offsetWidth;
        });

        const scrollLeft = await element.evaluate(
            node => node.scrollContainer.scrollWidth - node.scrollContainer.offsetWidth
        );

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            scrollLeft
        );

        await element.evaluateHandle(node => node.scrollToNext());

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            scrollLeft
        );
    });

    it("should change scroll stop on resize", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
            node.speed = 0;
        });

        await element.evaluateHandle(node => node.scrollToNext());

        const firstXPos = await element.evaluate(node => node.scrollContainer.scrollLeft);

        await element.evaluateHandle(node => node.scrollToPrevious());

        await element.waitForElementState("stable");

        await this.page.evaluate(
            ({ element, horizontalScrollWidth }) => {
                element.style.setProperty("width", `${horizontalScrollWidth * 2}px`);
            },
            { element, horizontalScrollWidth }
        );

        await element.waitForElementState("stable");

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        const secondXPos = await this.page.evaluate(
            element => element.scrollContainer.scrollLeft,
            element
        );

        expect(firstXPos).to.not.equal(secondXPos);
    });

    it("should enable the next flipper when content exceeds horizontal-scroll width", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        expect(
            await element.$eval(".scroll-next", node =>
                node.classList.contains("disabled")
            )
        ).to.be.false;
    });

    it("should disable the next flipper if content is less than horizontal-scroll width", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
            while (node.childElementCount > 1) {
                node.removeChild(node.lastElementChild!);
            }
        });

        expect(
            await element.evaluate(node =>
                node
                    .shadowRoot!.querySelector(".scroll-next")
                    ?.classList.contains("disabled")
            )
        ).to.be.true;
    });

    it("should disable the previous flipper by default", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        expect(
            await element.evaluate(node =>
                node
                    .shadowRoot!.querySelector(".scroll-prev")
                    ?.classList.contains("disabled")
            )
        ).to.be.true;
    });

    it("should enable the previous flipper when content is scrolled", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
            node.speed = 0;
        });

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        expect(
            await element.$eval(".scroll-prev", node =>
                node.classList.contains("disabled")
            )
        ).to.be.false;
    });

    it("should disable the previous flipper when scrolled back to the beginning", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
            node.speed = 0;
        });

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            cardsPerScreen * (cardWidth + scrollItemSpacing)
        );

        expect(
            await element.$eval(".scroll-prev", node =>
                node?.classList.contains("disabled")
            )
        ).to.be.false;

        await element.evaluateHandle((node: fastHorizontalScroll) => {
            node.scrollToPrevious();
        });

        await element.waitForElementState("stable");

        expect(
            await element.evaluate(node => node.scrollContainer.scrollLeft)
        ).to.be.closeTo(0, 0.5);

        expect(
            await element.$eval(".scroll-prev", node =>
                node.classList.contains("disabled")
            )
        ).to.be.true;
    });

    it("should disable the next flipper when it reaches the end of the content", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await this.page.evaluateHandle(node => {
            node.speed = 0;

            node.scrollContainer.scrollLeft =
                node.scrollContainer.scrollWidth -
                node.scrollContainer.offsetWidth -
                node.firstElementChild!.clientWidth;
        }, element);

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            await element.evaluate(
                (node, horizontalScrollWidth) =>
                    node.scrollContainer.scrollWidth - horizontalScrollWidth,
                horizontalScrollWidth
            )
        );

        expect(
            await element.$eval(".scroll-next", node =>
                node.classList.contains("disabled")
            )
        ).to.be.true;
    });

    it("should disable the previous flipper when it reaches the beginning of the content", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
            node.speed = 0;

            // Move the scrollLeft almost to the end
            node.scrollContainer.scrollLeft = node.firstElementChild!.clientWidth;

            node.scrollToPrevious();
        });

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            0
        );

        expect(
            await element.$eval(".scroll-prev", node =>
                node.classList.contains("disabled")
            )
        ).to.be.true;
    });
});
