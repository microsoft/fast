import type {
    Anchor as FASTAnchorType
} from "@microsoft/fast-foundation";
import chai from "chai";

const { expect } = chai;

type FASTAnchor = HTMLElement & FASTAnchorType;

describe("FASTAnchor", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.setupHandle = await this.page.evaluateHandle(
            (document) => {
                const element = document.createElement("fast-anchor") as FASTAnchor;
                element.href = "#";
                element.textContent = "Hello";
                element.id = "anchor1";

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

    // FASTAnchor should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("fast-anchor");

        expect(element).to.exist;
    });

    it("receive focus when focused programatically", async function () {
        const element = await this.page.waitForSelector("fast-anchor");

        await this.page.evaluateHandle(element => element.focus(), element)

        expect(await this.page.evaluate(
            () => document.activeElement?.id
        )).to.equal(await element.evaluate(node => node.id));
    });
});
