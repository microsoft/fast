import { expect } from "chai";
import { Accordion, accordionTemplate as template } from "./index";
import { AccordionItem, accordionItemTemplate as itemTemplate } from "../accordion-item";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
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

    it("should keep expanded item after focus on a different item in single mode", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("expand-mode", "single");

        await connect();
        await DOM.nextUpdate();

        const [accordionItem1, accordionItem2] = element.accordionItems;
        accordionItem2.shadowRoot?.querySelector("button")?.click();

        await DOM.nextUpdate();
        const accordionItem1ExpandedAfterItem2Click = accordionItem1.hasAttribute("expanded");
        const accordionItem2ExpandedAfterItem2Click = accordionItem2.hasAttribute("expanded");

        accordionItem1.dispatchEvent(new FocusEvent('focus'));

        const newItem = document.createElement("fast-accordion-item");
        element.appendChild(newItem);
        await DOM.nextUpdate();

        expect(accordionItem1ExpandedAfterItem2Click).to.equal(false);
        expect(accordionItem2ExpandedAfterItem2Click).to.equal(true);
        expect(accordionItem1.hasAttribute("expanded"), 'item 1 is expanded').to.equal(false);
        expect(accordionItem2.hasAttribute("expanded"), 'item 2 is closed').to.equal(true);
        await disconnect();
    });

    it("should respect starting expanded state of added items in single mode", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("expand-mode", "single");

        await connect();
        await DOM.nextUpdate();

        element.innerHTML = `
            <fast-accordion-item>Item 1</fast-accordion-item>
            <fast-accordion-item expanded>Item 2</fast-accordion-item>
            <fast-accordion-item>Item 3</fast-accordion-item>
        `;

        const [accordionItem1, accordionItem2] = element.accordionItems;

        await DOM.nextUpdate();

        expect(accordionItem1.hasAttribute("expanded"), 'item 1 is expanded').to.equal(false);
        expect(accordionItem2.hasAttribute("expanded"), 'item 2 is closed').to.equal(true);
        await disconnect();
    });

    it("should respect the first expanded item when items change in single mode", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("expand-mode", "single");

        await connect();
        await DOM.nextUpdate();

        element.innerHTML = `
            <fast-accordion-item>Item 1</fast-accordion-item>
            <fast-accordion-item expanded>Item 2</fast-accordion-item>
            <fast-accordion-item expanded>Item 3</fast-accordion-item>
        `;
        await DOM.nextUpdate();

        const [accordionItem1, accordionItem2, accordionItem3] = element.accordionItems;

        expect(accordionItem1.hasAttribute("expanded"), 'item 1 is expanded').to.equal(false);
        expect(accordionItem2.hasAttribute("expanded"), 'item 2 is closed').to.equal(true);
        expect(accordionItem3.hasAttribute("expanded"), 'item 3 is expanded').to.equal(false);
        await disconnect();
    });
});
