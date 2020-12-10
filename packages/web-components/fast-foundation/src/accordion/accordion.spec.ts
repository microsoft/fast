import { expect } from "chai";
import { Accordion, AccordionTemplate as template } from "./index";
import { AccordionItem, AccordionItemTemplate as itemTemplate } from "../accordion-item";
import { fixture } from "../fixture";
import { customElement, DOM, elements } from "@microsoft/fast-element";
import { AccordionExpandMode } from "./accordion";

@customElement({
    name: "fast-accordion",
    template,
})
class FASTAccordion extends Accordion {}

@customElement({
    name: "fast-accordion-item",
    template: itemTemplate,
})
class FASTAccordionItem extends AccordionItem {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTAccordion>(
        "fast-accordion"
    );

    const item1 = document.createElement("fast-accordion-item");
    const item2 = document.createElement("fast-accordion-item");
    const item3 = document.createElement("fast-accordion-item");

    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);

    return { element, connect, disconnect, item1, item2, item3 };
}

describe("Accordion", () => {
    it("should set an expand mode of `multi` when passed to the `expand-mode` attribute", async () => {
        const { element, connect, disconnect } = await setup();

        element.expandmode = AccordionExpandMode.multi;

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });

    it("should set an expand mode of `single` when passed to the `expand-mode` attribute", async () => {
        const { element, connect, disconnect } = await setup();

        element.expandmode = AccordionExpandMode.single;

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.single);

        await disconnect();
    });

    it("should set a default expand mode of `multi` when `expand-mode` attribute is not passed", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await DOM.nextUpdate();

        expect((element as FASTAccordion).expandmode).to.equal(AccordionExpandMode.multi);
        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });

    it("should add `aria-disabled` attribute when an accordion-item is expanded on a Accordion with `expand-mode` of `single`", async () => {
        const { element, connect, disconnect, item1 } = await setup();

        element.expandmode = AccordionExpandMode.single;
        await connect();

        item1.click();
        await DOM.nextUpdate();

        expect(item1.hasAttribute("aria-disabled")).to.be.true;

        await disconnect();
    });

    it("should NOT add `aria-disabled` attribute when an accordion-item is expanded on a Accordion with `expand-mode` of `multi`", async () => {
        const { element, connect, disconnect, item1 } = await setup();

        element.expandmode = AccordionExpandMode.multi;
        await connect();

        item1.click();
        await DOM.nextUpdate();

        expect(item1.hasAttribute("aria-disabled")).to.be.false;

        await disconnect();
    });
});
