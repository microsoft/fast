import { expect } from "chai";
import { FASTAccordion, accordionTemplate, AccordionExpandMode } from "./index.js";
import { FASTAccordionItem, accordionItemTemplate } from "../accordion-item/index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTCheckbox, checkboxTemplate } from "../checkbox/index.js";
import { Updates } from "@microsoft/fast-element";

const Accordion = FASTAccordion.define({
    name: uniqueElementName("accordion"),
    template: accordionTemplate()
});

const AccordionItem = FASTAccordionItem.define({
    name: uniqueElementName("accordion-item"),
    template: accordionItemTemplate()
});

const Checkbox = FASTCheckbox.define({
    name: uniqueElementName("checkbox"),
    template: checkboxTemplate()
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

    it("should expand/collapse items when clicked in multi mode", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        element.expandmode = AccordionExpandMode.multi;

        await connect();
        await Updates.next();

        expect(item1.expanded).to.equal(false);
        expect(item2.expanded).to.equal(false);
        expect(item3.expanded).to.equal(false);

        item1.expandbutton.click();
        item2.expandbutton.click();
        item3.expandbutton.click();

        await Updates.next();

        expect(item1.expanded).to.equal(true);
        expect(item2.expanded).to.equal(true);
        expect(item3.expanded).to.equal(true);

        item1.expandbutton.click();
        item2.expandbutton.click();
        item3.expandbutton.click();

        await Updates.next();

        expect(item1.expanded).to.equal(false);
        expect(item2.expanded).to.equal(false);
        expect(item3.expanded).to.equal(false);

        await disconnect();
    });

    it("should always be one item expanded in single mode", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        element.expandmode = AccordionExpandMode.single;

        await connect();
        await Updates.next();

        expect(item1.expanded).to.equal(true);
        expect(item2.expanded).to.equal(false);
        expect(item3.expanded).to.equal(false);

        item2.expandbutton.click();

        await Updates.next();

        expect(item1.expanded).to.equal(false);
        expect(item2.expanded).to.equal(true);
        expect(item3.expanded).to.equal(false);

        item2.expandbutton.click();

        await Updates.next();

        expect(item1.expanded).to.equal(false);
        expect(item2.expanded).to.equal(true);
        expect(item3.expanded).to.equal(false);

        await disconnect();
    });

    it("should ignore 'change' events from components other than accordion items", async () => {
        const { element, connect, disconnect, item1, item2, item3 } = await setup();

        element.expandmode = AccordionExpandMode.multi;
        const checkbox = new Checkbox();
        item1.appendChild(checkbox);

        await connect();
        await Updates.next();
        expect(item1.expanded).to.equal(false);

        item1.expandbutton.click();
        await Updates.next();
        expect(item1.expanded).to.equal(true);

        checkbox.click();
        await Updates.next();
        expect(item1.expanded).to.equal(true);

        await disconnect();
    });

});
