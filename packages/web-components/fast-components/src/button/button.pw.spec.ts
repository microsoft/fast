import type {
    Button as FASTButtonType
} from "@microsoft/fast-foundation";
import chai from "chai";

const { expect } = chai;

type FASTButton = HTMLElement & FASTButtonType;

describe("FASTButton", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.setupHandle = await this.page.evaluateHandle(
            (document) => {
                const element = document.createElement("fast-button") as FASTButton;
                element.textContent = "Hello";
                element.id = "Button1";

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

    // FASTButton should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("fast-button");

        expect(element).to.exist;
    });

    it("receive focus when focused programatically", async function () {
        const element = await this.page.waitForSelector("fast-button");

        await this.page.evaluateHandle(element => element.focus(), element)

        expect(await this.page.evaluate(
            () => document.activeElement?.id
        )).to.equal(await element.evaluate(node => node.id));
    });
});
