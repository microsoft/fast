import { expect } from "chai";
import { AccordionItem } from "./index";
import { fixture } from "../fixture";
import { DOM } from "@microsoft/fast-element";

describe("Accordion item", () => {
    const name = "AccordionItem";

    it("should set a heading level", async () => {
        const { element, connect } = await fixture<AccordionItem>("fast-accordion-item");

        element.headinglevel = 4;

        await connect();

        expect(element.headinglevel).to.equal(4);
    });

    // This is "fromView" so how do we test it?
    xit("should set a default heading level of 2 when NOT provided a `headinglevel` attribute", async () => {
        const { element, connect } = await fixture<AccordionItem>("fast-accordion-item");

        await connect();

        expect(element.headinglevel).to.equal(2);
    });

    it("should add a class of `expanded` when the expanded property is true", async () => {
        const { element, connect } = await fixture<AccordionItem>("fast-accordion-item");

        element.expanded = true;

        await connect();

        console.log(element.classList.toString(), "classlist to string");
        expect(element.classList.contains("expanded")).to.equal(true);
    });

    it("should NOT add a class of `expanded` when the expanded property is false", async () => {
        const { element, connect } = await fixture<AccordionItem>("fast-accordion-item");

        element.expanded = false;

        await connect();

        expect(element.classList.contains("expanded")).to.equal(false);
    });

    it("should add an attribute of `aria-expanded` when the expanded property is true", async () => {
        const { element, connect } = await fixture<AccordionItem>("fast-accordion-item");

        element.expanded = true;

        await connect();
        console.log(element.shadowRoot?.querySelector("button"), "button");
        expect(
            element.shadowRoot?.querySelector("button")?.hasAttribute("aria-expanded")
        ).to.equal(true);
    });
});
