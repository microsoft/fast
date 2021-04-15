import type { Dialog as FASTDialogType } from "@microsoft/fast-foundation";
import { expect } from "chai";
import type { ElementHandle } from "playwright";
import type { FASTDesignSystemProvider } from "../design-system-provider";

type FASTDialog = HTMLElement & FASTDialogType;

describe("FASTDialog", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.providerHandle = (await this.page.$("#root")) as ElementHandle<
            FASTDesignSystemProvider
        >;

        this.setupHandle = await this.page.evaluateHandle(
            ([document, provider]) => {
                const element = document.createElement("fast-dialog") as FASTDialog;
                element.id = "testelement";
                provider.appendChild(element);
            },
            [this.documentHandle, this.providerHandle] as [
                ElementHandle<Document>,
                ElementHandle<FASTDesignSystemProvider>
            ]
        );
    });

    afterEach(async function () {
        if (this.setupHandle) {
            await this.setupHandle.dispose();
        }
    });

    // FASTDialog should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("fast-dialog");

        expect(element).to.exist;
    });
});
