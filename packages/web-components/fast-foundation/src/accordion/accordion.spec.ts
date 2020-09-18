import { expect } from "chai";
import { Accordion, AccordionTemplate as template } from "./index";
import { AccordionItem, AccordionItemTemplate as itemTemplate } from "../accordion-item";
import { fixture } from "../fixture";
import { customElement, DOM } from "@microsoft/fast-element";
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

describe("Accordion", () => {
    it("should set an expand mode of `multi` when passed to the `expand-mode` attribute", async () => {
        const { element, connect, disconnect } = await fixture<FASTAccordion>(
            "fast-accordion"
        );
        const item1 = document.createElement("fast-accordion-item");
        const item2 = document.createElement("fast-accordion-item");
        const item3 = document.createElement("fast-accordion-item");

        element.appendChild(item1);
        element.appendChild(item2);
        element.appendChild(item3);

        element.expandmode = AccordionExpandMode.multi;

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });

    it("should set an expand mode of `single` when passed to the `expand-mode` attribute", async () => {
        const { element, connect, disconnect } = await fixture<FASTAccordion>(
            "fast-accordion"
        );
        const item1 = document.createElement("fast-accordion-item");
        const item2 = document.createElement("fast-accordion-item");
        const item3 = document.createElement("fast-accordion-item");

        element.appendChild(item1);
        element.appendChild(item2);
        element.appendChild(item3);

        element.expandmode = AccordionExpandMode.single;

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.single);

        await disconnect();
    });

    it("should set a default expand mode of `multi` when `expand-mode` attribute is not passed", async () => {
        const { element, connect, disconnect } = await fixture<FASTAccordion>(
            "fast-accordion"
        );
        const item1 = document.createElement("fast-accordion-item");
        const item2 = document.createElement("fast-accordion-item");
        const item3 = document.createElement("fast-accordion-item");

        element.appendChild(item1);
        element.appendChild(item2);
        element.appendChild(item3);

        await connect();
        await DOM.nextUpdate();

        expect((element as FASTAccordion).expandmode).to.equal(AccordionExpandMode.multi);
        expect(element.getAttribute("expand-mode")).to.equal(AccordionExpandMode.multi);

        await disconnect();
    });
});
