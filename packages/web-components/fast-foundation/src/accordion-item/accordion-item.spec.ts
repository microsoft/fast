import { expect } from "chai";
import { AccordionItem, AccordionItemTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";

describe("Accordion item", () => {
    const name = "AccordionItem";

    @customElement({
        name: "fast-accordion-item",
        template,
    })
    class FASTAccordionItem extends AccordionItem {}

    it("should set an `aria-level` to the heading when provided", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );

        element.headinglevel = 4;

        await connect();

        expect(element.headinglevel).to.equal(4);
        expect(
            element.shadowRoot
                ?.querySelector("[role='heading']")
                ?.getAttribute("aria-level")
        ).to.equal("4");
    });

    it("should set a default heading level of 2 when NOT provided a `headinglevel`", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );

        await connect();

        expect(element.headinglevel).to.equal(2);
        expect(
            element.shadowRoot
                ?.querySelector("[role='heading']")
                ?.getAttribute("aria-level")
        ).to.equal("2");
    });

    it("should add a class of `expanded` when expanded is true", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );

        element.expanded = true;

        await connect();

        expect(element.classList.contains("expanded")).to.equal(true);
    });

    it("should NOT add a class of `expanded` when expanded is false", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );

        element.expanded = false;

        await connect();

        expect(element.classList.contains("expanded")).to.equal(false);
    });

    it("should set `aria-expanded` value to false on the button when expanded is false", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );

        element.expanded = false;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("aria-expanded")
        ).to.equal("false");
    });

    it("should set `aria-expanded` value to false on the button when expanded is false", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );

        element.expanded = true;

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("aria-expanded")
        ).to.equal("true");
    });

    it("should set `aria-expanded` value to false on the button when expanded is undefined", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );

        await connect();

        expect(
            element.shadowRoot?.querySelector("button")?.getAttribute("aria-expanded")
        ).to.equal("false");
    });

    it("should set `aria-labelledby` value on the region when the id attribute is provided", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );
        const id: string = "testId";

        element.id = id;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector("[role='region']")
                ?.getAttribute("aria-labelledby")
        ).to.equal(id);
    });

    it("should set the id value on the button when the id attribute is provided", async () => {
        const { element, connect } = await fixture<FASTAccordionItem>(
            "fast-accordion-item"
        );
        const id: string = "testId";

        element.id = id;

        await connect();

        expect(element.shadowRoot?.querySelector("button")?.getAttribute("id")).to.equal(
            id
        );
    });
});
