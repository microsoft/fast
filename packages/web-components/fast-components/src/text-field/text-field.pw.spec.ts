import type {
    TextField as FASTTextFieldType,
} from "@microsoft/fast-foundation";
import { expect } from "chai";

type FASTTextField = HTMLElement & FASTTextFieldType;

describe("FASTTextField", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.setupHandle = await this.page.evaluateHandle(
            (document) => {
                const element = document.createElement("fast-text-field") as FASTTextField;

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

    // FASTTextField should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("fast-text-field");

        expect(element).to.exist;
    });

    it("receive focus when focused programatically", async function () {
        const element = await this.page.waitForSelector("fast-text-field");

        await this.page.evaluateHandle(element => element.focus(), element)

        expect(await this.page.evaluate(
            () => document.activeElement?.id
        )).to.equal(await element.evaluate(node => node.id));
    });
});
