import { expect } from "chai";
import { FASTSelect } from ".";
import { FASTOption } from "../listbox-option";

describe("FASTSelect", function () {
    let setupHandle;

    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        const documentHandle = await this.page.evaluateHandle(() => document);

        // evaluate and evaluateHandle functions are run in the browser's
        // context and can't use anything from any outer scope.
        setupHandle = await this.page.evaluateHandle(document => {
            const element = (document.createElement(
                "fast-select"
            ) as unknown) as FASTSelect;

            for (let i = 1; i <= 3; i++) {
                const option = document.createElement("fast-option") as FASTOption;
                option.value = `${i}`;
                option.textContent = `option ${i}`;
                element.appendChild(option);
            }

            document.getElementById("root-provider")!.appendChild(element);
        }, documentHandle);
    });

    afterEach(async function () {
        if (setupHandle) {
            await setupHandle.dispose();
        }
    });

    it("should render on the page", async function () {
        const element = await this.page.$("fast-select");

        expect(element).to.exist;
    });

    it("should have a value of 'one'", async function () {
        const element = await this.page.$("fast-select");
        expect(
            await element?.evaluate(node => ((node as unknown) as FASTSelect).value)
        ).to.equal("1");
    });

    it("should have a text content of 'option 1'", async function () {
        const element = await this.page.$("fast-select .selected-value");
        expect(await element?.evaluate((node: HTMLElement) => node.innerText)).to.equal(
            "option 1"
        );
    });
});
