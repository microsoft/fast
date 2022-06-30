import { expect } from "chai";
import { FASTAccordion, accordionTemplate, AccordionExpandMode } from "./index.js";
import { FASTAccordionItem, accordionItemTemplate } from "../accordion-item/index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";

const Accordion = FASTAccordion.define({
    name: uniqueElementName("accordion"),
    template: accordionTemplate()
});

const AccordionItem = FASTAccordionItem.define({
    name: uniqueElementName("accordion-item"),
    template: accordionItemTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture(Accordion);

    const item1 = new AccordionItem();
    const item2 = new AccordionItem();
    const item3 = new AccordionItem();

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
        await Updates.next();

        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });

    it("should set an expand mode of `single` when passed to the `expand-mode` attribute", async () => {
        const { element, connect, disconnect } = await setup();

        element.expandmode = AccordionExpandMode.single;

        await connect();
        await Updates.next();

        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.single);

        await disconnect();
    });

    it("should set a default expand mode of `multi` when `expand-mode` attribute is not passed", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await Updates.next();

        expect((element as FASTAccordion).expandmode).to.equal(AccordionExpandMode.multi);
        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });
});
