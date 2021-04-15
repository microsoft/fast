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

                const button1 = document.createElement("button");
                button1.id = "button1";
                element.appendChild(button1);

                const button2 = document.createElement("button");
                button2.id = "button2";
                element.appendChild(button2);

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
        const element = await this.page.$("fast-dialog");

        expect(element).to.exist;
    });

    // FASTDialog should render on the page
    it("should trap focus by default", async function () {
        const element = await this.page.$("fast-dialog");

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

    });

    it("should trap focus when element id's are specified", async function () {
        const element = await this.page.$("fast-dialog");

        expect(element).to.exist;

        await element?.evaluate(node => (node as FASTDialog).tabQueueStart = "button1");
        await element?.evaluate(node => (node as FASTDialog).tabQueueEnd = "button2");

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");
    });

    it("should trap focus when element instances are specified", async function () {
        const element = await this.page.$("fast-dialog");

        expect(element).to.exist;

        await element?.evaluate(node => (node as FASTDialog).tabQueueStart = document.getElementById("button1") as HTMLElement);
        await element?.evaluate(node => (node as FASTDialog).tabQueueEnd = document.getElementById("button2") as HTMLElement);

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");
    });

    it("should trap focus when callback functions are specified", async function () {
        const element = await this.page.$("fast-dialog");

        expect(element).to.exist;

        await element?.evaluate(node => (node as FASTDialog).tabQueueStart = () => { return document.getElementById("button1") as HTMLElement });
        await element?.evaluate(node => (node as FASTDialog).tabQueueEnd = () => { return document.getElementById("button2") as HTMLElement });

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");
    });

    // FASTDialog should render on the page
    it("should trap focus by default", async function () {
        const element = await this.page.$("fast-dialog");

        await element?.focus();

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

    });

    it("should trap focus when element id's are specified", async function () {
        const element = await this.page.$("fast-dialog");

        await element?.evaluate(node => (node as FASTDialog).tabQueueStart = "button1");
        await element?.evaluate(node => (node as FASTDialog).tabQueueEnd = "button2");

        await element?.focus();

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");
    });

    it("should trap focus when element instances are specified", async function () {
        const element = await this.page.$("fast-dialog");

        await element?.evaluate(node => (node as FASTDialog).tabQueueStart = document.getElementById("button1") as HTMLElement);
        await element?.evaluate(node => (node as FASTDialog).tabQueueEnd = document.getElementById("button2") as HTMLElement);

        await element?.focus();

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");
    });

    it("should trap focus when callback functions are specified", async function () {
        const element = await this.page.$("fast-dialog");

        await element?.evaluate(node => (node as FASTDialog).tabQueueStart = () => { return document.getElementById("button1") as HTMLElement });
        await element?.evaluate(node => (node as FASTDialog).tabQueueEnd = () => { return document.getElementById("button2") as HTMLElement });

        await element?.focus();

        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button2");

        await element?.press("Shift+Tab");
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");
    });
});
