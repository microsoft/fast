import { expect } from "chai";
import { FASTAccordionItem, accordionItemTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";

const name = uniqueElementName();
FASTAccordionItem.define({
    name,
    template: accordionItemTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTAccordionItem>(name);

    return { element, connect, disconnect };
}

describe("Accordion item", () => {
    it("should set an `aria-level` to the heading when provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.headinglevel = 4;

        await connect();

        expect(element.headinglevel).to.equal(4);
        expect(
            element.shadowRoot
                ?.querySelector("[role='heading']")
                ?.getAttribute("aria-level")
        ).to.equal("4");

        await disconnect();
    });

    it("should set a default heading level of 2 when NOT provided a `headinglevel`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.headinglevel).to.equal(2);
        expect(
            element.shadowRoot
                ?.querySelector("[role='heading']")
                ?.getAttribute("aria-level")
        ).to.equal("2");

        await disconnect();
    });

    it("should add a class of `expanded` when expanded is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.expanded = true;

        await connect();

        expect(element.classList.contains("expanded")).to.equal(true);

        await disconnect();
    });

    it("should NOT add a class of `expanded` when expanded is false", async () => {
        const { element, connect, disconnect } = await setup();

        element.expanded = false;

        await connect();

        expect(element.classList.contains("expanded")).to.equal(false);

        await disconnect();
    });

    it("should set `aria-expanded` value to false on the button when expanded is false", async () => {
        const { element, connect, disconnect } = await setup();

        element.expanded = false;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("aria-expanded")
        ).to.equal("false");

        await disconnect();
    });

    it("should set `aria-expanded` value to false on the button when expanded is false", async () => {
        const { element, connect, disconnect } = await setup();

        element.expanded = true;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("aria-expanded")
        ).to.equal("true");

        await disconnect();
    });

    it("should set `aria-expanded` value to false on the button when expanded is undefined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("aria-expanded")
        ).to.equal("false");

        await disconnect();
    });

    it("should set `aria-labelledby` value on the region when the id attribute is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const id: string = "testId";

        element.id = id;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector("[role='region']")
                ?.getAttribute("aria-labelledby")
        ).to.equal(id);

        await disconnect();
    });

    it("should set the id value on the button when the id attribute is provided", async () => {
        const { element, connect, disconnect } = await setup();
        const id: string = "testId";

        element.id = id;

        await connect();

        expect(element.shadowRoot?.querySelector("button")?.getAttribute("id")).to.equal(
            id
        );

        await disconnect();
    });
});
