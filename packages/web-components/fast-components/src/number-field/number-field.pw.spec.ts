import type {
    NumberField as FASTNumberFieldType,
} from "@microsoft/fast-foundation";
import { expect } from "chai";

type FASTNumberField = HTMLElement & FASTNumberFieldType;

describe("FASTNumberField", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.setupHandle = await this.page.evaluateHandle(
            (document) => {
                const element = document.createElement("fast-number-field") as FASTNumberField;

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

    // FASTNumberField should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("fast-number-field");

        expect(element).to.exist;
    });

    it("receive focus when focused programatically", async function () {
        const element = await this.page.waitForSelector("fast-number-field");

        await this.page.evaluateHandle(element => element.focus(), element)

        expect(await this.page.evaluate(
            () => document.activeElement?.id
        )).to.equal(await element.evaluate(node => node.id));
    });
});
