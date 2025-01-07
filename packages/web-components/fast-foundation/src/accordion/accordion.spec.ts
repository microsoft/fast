import { expect } from "chai";
import { Accordion, accordionTemplate as template } from "./index";
import { AccordionItem, accordionItemTemplate as itemTemplate } from "../accordion-item";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@ni/fast-element";
import { AccordionExpandMode } from "./accordion";

const FASTAccordion = Accordion.compose({
    baseName: "accordion",
    template
})

const FASTAccordionItem = AccordionItem.compose({
    baseName: "accordion-item",
    template: itemTemplate,
})

async function setup() {
    const { element, connect, disconnect } = await fixture([FASTAccordion(), FASTAccordionItem()]);

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

        expect((element as Accordion).expandmode).to.equal(AccordionExpandMode.multi);
        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });
});
