import type {
    ListboxElement as FASTListboxType,
    ListboxOption as FASTOption,
} from "@microsoft/fast-foundation";
import type { ElementHandle } from "playwright";
import chai from "chai";

const { expect } = chai;

type FASTListbox = HTMLElement & FASTListboxType;

describe("FASTListbox", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.setupHandle = await this.page.evaluateHandle(
            (document) => {
                const element = document.createElement("fast-listbox") as FASTListbox;

                for (let i = 1; i <= 3; i++) {
                    const option = document.createElement("fast-option") as FASTOption;
                    option.value = `${i}`;
                    option.textContent = `option ${i}`;
                    element.appendChild(option);
                }

                document.body.appendChild(element)
            },
            this.documentHandle
        );
    });

    afterEach(async function () {
        if (this.setupHandle) {
            await this.setupHandle.dispose();
        }
    });

    // FASTListbox should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("fast-listbox");

        expect(element).to.exist;
    });

    describe("should change the `selectedIndex` when focused and receives keyboard interaction", function () {
        it("via arrow down key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-listbox"
            )) as ElementHandle<FASTListbox>;

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(-1);

            await element.press("ArrowDown");

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(0);
        });

        it("via arrow up key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-listbox"
            )) as ElementHandle<FASTListbox>;

            await element.evaluate(node => (node.selectedIndex = 1));

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(1);

            await element.press("ArrowUp");

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(0);
        });

        it("via home key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-listbox"
            )) as ElementHandle<FASTListbox>;

            await element.evaluate(node => (node.selectedIndex = 2));

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(2);

            await element.press("Home");

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(0);
        });

        it("via end key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-listbox"
            )) as ElementHandle<FASTListbox>;

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(-1);

            await element.press("End");

            expect(await element.evaluate(node => node.selectedIndex)).to.equal(2);
        });
    });
});
