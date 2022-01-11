import type { VirtualizingStack as VirtualizingStackType } from "@microsoft/fast-foundation";
import { assert, expect } from "chai";
import { ElementHandle } from "playwright";

type fastVirtualizingStack = HTMLElement & VirtualizingStackType;

function newDataSet(rowCount: number): object[] {
    const newData: object[] = [];
    for (let i = 1; i <= rowCount; i++) {
        newData.push({
            value: `${i}`,
        });
    }
    return newData;
}

describe("FASTVirtualizingStack", function () {
    const baseData = newDataSet(100);
    const componentWidth = 400;

    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        await this.page.evaluateHandle(
            ({ baseData, componentWidth }) => {
                const element = document.createElement(
                    "fast-virtualizing-stack"
                ) as fastVirtualizingStack;

                // element.items = baseData;
                // element.virtualize = false;
                // element.style.setProperty("width", `${componentWidth}px`);

                // element.id = "VirtualizingStack1";

                document.body.appendChild(element);
                return element;
            },
            {
                baseData,componentWidth,
            }
        );
    });

    afterEach(async function () {
        if (this.setupHandle) {
            await this.setupHandle.dispose();
        }
    });

    // fastVirtualizingStack should render on the page
    it("should render on the page", async function () {
        const element = (await this.page.waitForSelector(
            "fast-virtualizing-stack"
        )) as ElementHandle<fastVirtualizingStack>;

        expect(element).to.exist;
    });
});
