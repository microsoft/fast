import type { VirtualList as VirtualListType } from "@microsoft/fast-foundation";
import { assert, expect } from "chai";
import { ElementHandle, Locator } from "playwright";

type fastVirtualList = HTMLElement & VirtualListType;

function newDataSet(rowCount: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${i}`,
        });
    }
    return newData;
}

describe("FASTVirtualList", function () {
    const baseData = newDataSet(100);
    const componentWidth = 400;
    const componentHeight = 400;
    const viewportBuffer = 0;
    const itemSize = 100;

    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        await this.page.evaluateHandle(
            ({ baseData, componentWidth, componentHeight, viewportBuffer, itemSize }) => {
                const element = document.createElement(
                    "fast-virtual-list"
                ) as fastVirtualList;

                element.items = baseData;
                element.viewportBuffer = viewportBuffer;
                element.itemSize = itemSize;
                element.autoUpdateMode = "auto";
                element.style.setProperty("width", `${componentWidth}px`);
                element.style.setProperty("height", `${componentHeight}px`);
                element.style.setProperty("overflow-y", `scroll`);

                element.id = "stack1";

                document.body.appendChild(element);

                return element;
            },
            {
                baseData, componentWidth, componentHeight, viewportBuffer, itemSize,
            }
        );
    });

    afterEach(async function () {
        if (this.setupHandle) {
            await this.setupHandle.dispose();
        }
    });

    it("should render on the page", async function () {
        const element = (await this.page.waitForSelector(
            "fast-virtual-list"
        )) as ElementHandle<fastVirtualList>;
        expect(element).to.exist;
    });

    it("should only render items in the viewport", async function () {
        let element = (await this.page.waitForSelector(
            "fast-virtual-list"
        )) as ElementHandle<fastVirtualList>;

        expect(await element.evaluate(node => (node as fastVirtualList).firstRenderedIndex)).to.equal(0);
        expect(await element.evaluate(node => (node as fastVirtualList).lastRenderedIndex)).to.equal(4);
    });

    it("should update the visible items when component is scrolled", async function () {
        let element = (await this.page.waitForSelector(
            "fast-virtual-list"
        )) as ElementHandle<fastVirtualList>;


        expect(await element.evaluate(node => (node as fastVirtualList).firstRenderedIndex)).to.equal(0);
        expect(await element.evaluate(node => (node as fastVirtualList).lastRenderedIndex)).to.equal(4);

        await element.evaluateHandle(node => {
            node.scrollTop=800;
        });
        await element.waitForElementState("stable");

        expect(await element.evaluate(node => (node as fastVirtualList).scrollTop)).to.equal(800);

        expect(await element.evaluate(node => (node as fastVirtualList).firstRenderedIndex)).to.equal(8);
        expect(await element.evaluate(node => (node as fastVirtualList).lastRenderedIndex)).to.equal(12);
    });

    it("should update the visible items when component is resized", async function () {
        let element = (await this.page.waitForSelector(
            "fast-virtual-list"
        )) as ElementHandle<fastVirtualList>;


        expect(await element.evaluate(node => (node as fastVirtualList).firstRenderedIndex)).to.equal(0);
        expect(await element.evaluate(node => (node as fastVirtualList).lastRenderedIndex)).to.equal(4);

        await element.evaluateHandle(node => {
            node.style.height="800px";
        });
        await element.waitForElementState("stable");

        expect(await element.evaluate(node => (node as fastVirtualList).firstRenderedIndex)).to.equal(0);
        expect(await element.evaluate(node => (node as fastVirtualList).lastRenderedIndex)).to.equal(8);
    });

    it("should correctly calculate total stack size", async function () {
        let element = (await this.page.waitForSelector(
            "fast-virtual-list"
        )) as ElementHandle<fastVirtualList>;


        expect(await element.evaluate(node => (node as fastVirtualList).totalListSize)).to.equal(10000);
    });

});
