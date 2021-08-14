import type { Dialog as FASTDialogType } from "@microsoft/fast-foundation";
import { expect } from "chai";

type FASTDialog = HTMLElement & FASTDialogType;

describe("FASTDialog", function () {
    beforeEach(async function () {
        if (!this.page && !this.browser) {
            this.skip();
        }

        this.documentHandle = await this.page.evaluateHandle(() => document);

        this.setupHandle = await this.page.evaluateHandle(
            (document) => {
                const element = document.createElement("fast-dialog") as FASTDialog;
                element.id = "testelement";

                const button1 = document.createElement("button");
                button1.id = "button1";
                element.appendChild(button1);

                const button2 = document.createElement("button");
                button2.id = "button2";
                element.appendChild(button2);

                document.body.appendChild(element);
            },
            this.documentHandle
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

    // FASTDialog should focus on the first element
    it("should focus on first element", async function () {
        const element = await this.page.$("fast-dialog");
    
        expect(
            await this.page.evaluate(
                () => document.activeElement?.id
            )
        ).to.equal("button1");
    });

    // FASTDialog should trap focus
    it("should trap focus", async function () {
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
});
