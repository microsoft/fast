import type {
    ListboxOption as FASTOption,
    Select as FASTSelectType,
} from "@microsoft/fast-foundation";
import { expect } from "chai";
import type { ElementHandle } from "playwright";

type FASTSelect = HTMLElement & FASTSelectType;

describe("FASTSelect", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.setupHandle = await this.page.evaluateHandle(
            (document) => {
                const element = document.createElement("fast-select") as FASTSelect;

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

    // FASTSelect should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("fast-select");

        expect(element).to.exist;
    });

    // FASTSelect should have a value of 'one'
    it("should have a value of 'one'", async function () {
        const element = await this.page.waitForSelector("fast-select");
        expect(await element?.evaluate(node => (node as FASTSelect).value)).to.equal("1");
    });

    // FASTSelect should have a text content of 'option 1'
    it("should have a text content of 'option 1'", async function () {
        const element = await this.page.waitForSelector("fast-select .selected-value");
        expect(await element?.evaluate((node: HTMLElement) => node.innerText)).to.equal(
            "option 1"
        );
    });

    // FASTSelect should open when focused and receives keyboard interaction
    describe("should open when focused and receives keyboard interaction", function () {
        // FASTSelect should open when focused and receives keyboard interaction via space key
        it("via Space key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-select"
            )) as ElementHandle<FASTSelect>;

            expect(await element.evaluate(node => node.open)).to.be.false;

            await element.focus();

            await this.page.keyboard.press(" ");

            expect(await element.evaluate(node => node.open)).to.be.true;

            await this.page.keyboard.press(" ");

            expect(await element.evaluate(node => node.open)).to.be.false;
        });

        // FASTSelect should open when focused and receives keyboard interaction via enter key
        it("via Enter key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-select"
            )) as ElementHandle<FASTSelect>;

            expect(await element.evaluate(node => node.open)).to.be.false;

            await element.focus();

            await element.press("Enter");

            expect(await element.evaluate(node => node.open)).to.be.true;

            await element.press("Enter");

            expect(await element.evaluate(node => node.open)).to.be.false;
        });
    });

    // FASTSelect should close
    describe("should close", function () {
        // FASTSelect should close when focused and keyboard interaction is received
        describe("when focused and keyboard interaction is received", function () {
            // FASTSelect should close when focused and keyboard interaction is received via space key
            it("via Space key", async function () {
                const element = (await this.page.waitForSelector(
                    "fast-select"
                )) as ElementHandle<FASTSelect>;

                await element.press(" ");

                expect(await element.evaluate(node => node.open)).to.be.true;

                await element.press(" ");

                expect(await element.evaluate(node => node.open)).to.be.false;
            });

            // FASTSelect should close when focused and keyboard interaction is received via enter key
            it("via Enter key", async function () {
                const element = (await this.page.waitForSelector(
                    "fast-select"
                )) as ElementHandle<FASTSelect>;

                await element.press("Enter");

                expect(await element.evaluate(node => node.open)).to.be.true;

                await element.press("Enter");

                expect(await element.evaluate(node => node.open)).to.be.false;
            });

            // FASTSelect should close when focused and keyboard interaction is received via escape key
            it("via Escape key", async function () {
                const element = (await this.page.waitForSelector(
                    "fast-select"
                )) as ElementHandle<FASTSelect>;

                await element.click();

                expect(await element.evaluate(node => node.open)).to.be.true;

                await this.page.keyboard.press("Escape");

                expect(await element.evaluate(node => node.open)).to.be.false;
            });

            // FASTSelect should close when focused and keyboard interaction is received via tab key
            it("via Tab key", async function () {
                const element = (await this.page.waitForSelector(
                    "fast-select"
                )) as ElementHandle<FASTSelect>;

                await element.click();

                expect(await element.evaluate(node => node.open)).to.be.true;

                await element.press("Tab");

                expect(await element.evaluate(node => node.open)).to.be.false;
            });
        });

        describe("when focus is lost", function () {
            it("via click", async function () {
                const element = (await this.page.waitForSelector(
                    "fast-select"
                )) as ElementHandle<FASTSelect>;

                await element.click();

                expect(await element.evaluate(node => node.open)).to.be.true;

                await this.page.click("body");

                expect(
                    await this.page.evaluate(
                        element => element.isSameNode(document.activeElement),
                        element
                    )
                ).to.be.false;

                expect(await element.evaluate(node => node.open)).to.be.false;
            });
        });
    });

    describe("should change the value when focused and receives keyboard interaction", function () {
        it("via arrow down key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-select"
            )) as ElementHandle<FASTSelect>;

            expect(await element.evaluate(node => node.value)).to.equal("1");

            await element.press("ArrowDown");

            expect(await element.evaluate(node => node.value)).to.equal("2");
        });

        it("via arrow up key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-select"
            )) as ElementHandle<FASTSelect>;

            await element.evaluate(node => (node.value = "2"));

            expect(await element.evaluate(node => node.value)).to.equal("2");

            await element.press("ArrowUp");

            expect(await element.evaluate(node => node.value)).to.equal("1");
        });

        it("via home key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-select"
            )) as ElementHandle<FASTSelect>;

            await element.evaluate(node => (node.value = "3"));

            expect(await element.evaluate(node => node.value)).to.equal("3");

            await element.press("Home");

            expect(await element.evaluate(node => node.value)).to.equal("1");
        });

        it("via end key", async function () {
            const element = (await this.page.waitForSelector(
                "fast-select"
            )) as ElementHandle<FASTSelect>;

            expect(await element.evaluate(node => node.value)).to.equal("1");

            await element.press("End");

            expect(await element.evaluate(node => node.value)).to.equal("3");
        });
    });

    describe("when opened", function () {
        it("should scroll the selected option into view", async function () {
            const element = (await this.page.waitForSelector(
                "fast-select"
            )) as ElementHandle<FASTSelect>;

            await element.evaluate(element => {
                element.innerHTML = "";
                for (let i = 0; i < 50; i++) {
                    const option = document.createElement("fast-option") as FASTOption;
                    option.value = `${i}`;
                    option.textContent = `option ${i}`;
                    element.appendChild(option);
                }
            });

            const selectedOption = (await element.$(".listbox")) as ElementHandle<
                FASTOption
            >;

            await element.evaluate(node => (node.selectedIndex = 35));

            expect(
                await element.evaluate(node => node.firstSelectedOption.value)
            ).to.equal("35");

            await element.click();

            await selectedOption.waitForElementState("visible");

            expect(
                await selectedOption.evaluate(node => node.scrollTop)
            ).to.be.closeTo(811, 16);

            await element.evaluate(node => (node.selectedIndex = 0));

            await element.waitForElementState("stable");

            expect(
                await selectedOption.evaluate(node => node.scrollTop)
            ).to.be.closeTo(6, 16);
        });
    });
});
