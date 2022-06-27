import { expect } from "chai";
import { FoundationAccordion, createAccordionTemplate, AccordionExpandMode } from "./index.js";
import { FoundationAccordionItem, createAccordionItemTemplate } from "../accordion-item/index.js";
import { fixture, uniqueElementName } from "../testing/fixture.js";
import { Updates } from "@microsoft/fast-element";

const accordionName = uniqueElementName();
FoundationAccordion.define(FoundationAccordion, {
    name: accordionName,
    template: createAccordionTemplate()
})

const accordionItemName = uniqueElementName();
FoundationAccordionItem.define(FoundationAccordionItem, {
    name: accordionItemName,
    template: createAccordionItemTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FoundationAccordion>(accordionName);

    const item1 = document.createElement(accordionItemName);
    const item2 = document.createElement(accordionItemName);
    const item3 = document.createElement(accordionItemName);

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

        expect((element as FoundationAccordion).expandmode).to.equal(AccordionExpandMode.multi);
        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });
});
