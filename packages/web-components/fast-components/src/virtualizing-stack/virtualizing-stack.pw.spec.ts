import type { VirtualizingStack as VirtualizingStackType } from "@microsoft/fast-foundation";
import { assert, expect } from "chai";
import { ElementHandle } from "playwright";

type fastVirtualizingStack = HTMLElement & VirtualizingStackType;

describe("FASTVirtualizingStack", function () {
    const componentWidth = 400;

    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        await this.page.evaluateHandle(
            ({ componentWidth }) => {
                const element = document.createElement(
                    "fast-virtualizing-stack"
                ) as fastVirtualizingStack;

                element.style.setProperty("width", `${componentWidth}px`);

                element.id = "VirtualizingStack1";

                document.body.appendChild(element);

                return element;
            },
            {
                componentWidth,
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
            "fast-horizontal-scroll"
        )) as ElementHandle<fastVirtualizingStack>;

        expect(element).to.exist;
    });
});
