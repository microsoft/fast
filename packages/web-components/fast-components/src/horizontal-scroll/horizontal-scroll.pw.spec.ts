import type { HorizontalScroll as HorizontalScrollType } from "@microsoft/fast-foundation";
import chai from "chai";
import { ElementHandle } from "playwright";
const { expect } = chai;

type fastHorizontalScroll = HTMLElement & HorizontalScrollType;

describe("FASTHorizontalScroll", function () {
    const componentWidth = 400;
    const itemCount = 16;
    const itemHeight = 200;
    const itemWidth = 120;
    const itemSpacing = 5;

    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        await this.page.evaluateHandle(
            ({ componentWidth, itemCount, itemHeight, itemSpacing, itemWidth }) => {
                const element = document.createElement(
                    "fast-horizontal-scroll"
                ) as fastHorizontalScroll;

                element.style.setProperty("width", `${componentWidth}px`);
                element.style.setProperty("--scroll-item-spacing", `${itemSpacing}px`);
                element.duration = "0s";

                for (let i = 0; i <= itemCount; i++) {
                    const card = document.createElement("div");
                    card.innerText = `card ${i}`;
                    card.style.setProperty("height", `${itemHeight}px`);
                    card.style.setProperty("width", `${itemWidth}px`);
                    element.appendChild(card);
                }

                element.id = "HorizontalScroll1";

                document.body.appendChild(element);

                return element;
            },
            {
                componentWidth,
                itemCount,
                itemHeight,
                itemSpacing,
                itemWidth,
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

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            250
        );
    });

    it("should not scroll past the beginning", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(0);

        await element.evaluateHandle(node => node.scrollToPrevious());

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            0
        );
    });

    it("should not scroll past the last in-view element", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => {
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

        const doubleWidth = componentWidth * 2;

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        const firstXPos = await element.evaluate(node => node.scrollContainer.scrollLeft);

        await element.evaluateHandle(node => node.scrollToPrevious());

        await element.waitForElementState("stable");

        await element.evaluateHandle((node, doubleWidth) => {
            node.style.setProperty("width", `${doubleWidth}px`);
        }, doubleWidth);

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.clientWidth)).to.equal(doubleWidth);

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        const secondXPos = await element.evaluate(
            node => node.scrollContainer.scrollLeft
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
                if (node.lastElementChild) {
                    node.removeChild(node.lastElementChild);
                }
            }
        });

        await element.waitForElementState("stable");

        expect(
            await element.evaluate(node =>
                node.shadowRoot?.querySelector(".scroll-next")
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
                node.shadowRoot?.querySelector(".scroll-prev")?.classList.contains("disabled")
            )
        ).to.be.true;
    });

    it("should enable the previous flipper when content is scrolled", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await element.evaluateHandle(node => node.scrollToNext());

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

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            250
        );

        expect(
            await element.$eval(".scroll-prev", node =>
                node?.classList.contains("disabled")
            )
        ).to.be.false;

        await element.evaluateHandle(node => node.scrollToPrevious());

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

    it("should disable the next flipper when it reaches the end of the content", async function () {
        const element = (await this.page.waitForSelector(
            "fast-horizontal-scroll"
        )) as ElementHandle<fastHorizontalScroll>;

        await this.page.evaluateHandle(node => {
            if (node.firstElementChild) {
                node.scrollContainer.scrollLeft =
                    node.scrollContainer.scrollWidth -
                    node.scrollContainer.offsetWidth -
                    node.firstElementChild.clientWidth;
            }
        }, element);

        await element.evaluateHandle(node => node.scrollToNext());

        await element.waitForElementState("stable");

        expect(await element.evaluate(node => node.scrollContainer.scrollLeft)).to.equal(
            await element.evaluate(
                (node, componentWidth) =>
                    node.scrollContainer.scrollWidth - componentWidth,
                componentWidth
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
            // Move the scrollLeft almost to the end
            if (node.firstElementChild) {
                node.scrollContainer.scrollLeft = node.firstElementChild.clientWidth;
            }

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
