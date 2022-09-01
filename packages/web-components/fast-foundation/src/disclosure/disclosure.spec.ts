import { Updates } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTDisclosure, disclosureTemplate } from "./index.js";

const disclosureName = uniqueElementName();
FASTDisclosure.define({
    name: disclosureName,
    template: disclosureTemplate()
})

async function createDisclosure() {
    const { element, connect, disconnect } = await fixture<FASTDisclosure>(disclosureName);

    return { element, connect, disconnect };
}

describe("Disclosure", () => {
    it("should set the expanded attribute to false when no value is provided", async () => {
        const { element, connect, disconnect } = await createDisclosure();
        await connect();

        await Updates.next();

        expect(element.expanded).to.equal(false);

        await disconnect();
    });

    it("should set the expanded attribute to true when set to true", async () => {
        const { element, connect, disconnect } = await createDisclosure();

        await connect();

        element.expanded = true;

        await Updates.next();

        expect(element.expanded).to.equal(true);

        await disconnect();
    });

    it("should set the expanded attribute to false when set to false", async () => {
        const { element, connect, disconnect } = await createDisclosure();

        await connect();

        element.expanded = false;

        await Updates.next();

        expect(element.expanded).to.equal(false);

        await disconnect();
    });

    it("should set summary slot content to the value of the summary attribute", async () => {
        const { element, connect, disconnect } = await createDisclosure();

        const summary: string = "Should set the summary slot content to the value of the summary attribute";

        await connect();

        element.summary = summary;

        await Updates.next();

        expect(element.shadowRoot?.querySelector("slot[name='summary']")?.innerHTML).to.equal(summary);

        await disconnect();
    });
    describe("User interaction", () => {
        it("should toggle the content using `toggle()`", async () => {
            const { element, connect, disconnect } = await createDisclosure();

            await connect();

            element.toggle();

            await Updates.next();

            expect(element.expanded).to.equal(true);

            await disconnect();
        });

        it("should expand and collapse the content using `show()` and `hide()`", async () => {
            const { element, connect, disconnect } = await createDisclosure();

            await connect();

            element.show();

            await Updates.next();

            expect(element.expanded).to.equal(true);

            element.hide();

            await Updates.next();

            expect(element.expanded).to.equal(false);

            await disconnect();
        });
    });

    describe("Accessibility", () => {
        it("should set the `aria-controls` attribute on the internal summary element", async () => {
            const { element, connect, disconnect } = await createDisclosure();
            const ariaControls = "disclosure-content";

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("summary")
                    ?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-expanded` attribute on the internal summary element", async () => {
            const { element, connect, disconnect } = await createDisclosure();
            const ariaExpanded = true;

            element.expanded = ariaExpanded;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("summary")
                    ?.getAttribute("aria-expanded")
            ).to.equal(ariaExpanded.toString());

            await disconnect();
        });
    });
});
