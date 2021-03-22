import { expect } from "chai";
import type { ElementHandle } from "playwright";
import type { FASTAnchoredRegion } from ".";
import type { FASTDesignSystemProvider } from "../design-system-provider";

describe("FASTAnchoredRegion", function () {
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
                const viewport: HTMLDivElement = document.createElement("div") as HTMLDivElement;
                viewport.setAttribute("id", "viewport");
                viewport.style.height="1000px";
                viewport.style.width="1000px";
                provider.appendChild(viewport);

                const anchor: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                anchor.setAttribute("id", "anchor");
                anchor.style.height="100px";
                anchor.style.width="100px";
                viewport.appendChild(anchor);

                const element:FASTAnchoredRegion = document.createElement("fast-anchored-region") as FASTAnchoredRegion;
                element.setAttribute("id", "region");
                element.setAttribute("vertical-positioning-mode", "dynamic");
                element.setAttribute("horizontal-positioning-mode", "dynamic");
                element.setAttribute("anchor", "anchor");
                element.setAttribute("viewport", "viewport");

                const contents: HTMLDivElement = document.createElement("div") as HTMLDivElement;
                contents.style.height="80px";
                contents.style.width="80px";
                element.appendChild(contents);

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

    // FASTAnchoredRegion should render on the page
    it("should render on the page", async function () {
        const element = await this.page.waitForSelector("#region");

        expect(element).to.exist;
    });

    it("should size to content by default", async function () {
        const element = await this.page.waitForSelector("#region");

        expect(await element.evaluate(node => node.clientHeight)).to.equal(80);
        expect(await element.evaluate(node => node.clientWidth)).to.equal(80);
    });

    it("should size to anchor when specified", async function () {
        const element = await this.page.waitForSelector("#region");
        
        await element.evaluate(node => node.setAttribute("horizontal-scaling", "anchor"));
        await element.evaluate(node => node.setAttribute("vertical-scaling", "anchor"));

        await this.page.waitForTimeout(1000);

        expect(await element.evaluate(node => node.clientHeight)).to.equal(100);
        expect(await element.evaluate(node => node.clientWidth)).to.equal(100);
    });
});