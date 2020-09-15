import { expect } from "chai";
import { Accordion, AccordionTemplate as template } from "./index";
import { AccordionItem, AccordionItemTemplate as itemTemplate } from "../accordion-item";
import { fixture } from "../fixture";
import { customElement, html, DOM } from "@microsoft/fast-element";
import { AccordionExpandMode } from "./accordion";

describe("Accordion", () => {
    const name = "Accordion";

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

    it("should set an expand mode of `multi` when passed to the `expand-mode` attribute", async () => {
        const { element, connect } = await fixture(html<FASTAccordion>`
            <fast-accordion expand-mode="${AccordionExpandMode.multi}">
                <fast-acordion-item>Foo</fast-accordion-item>
                <fast-acordion-item>Bar</fast-accordion-item>
                <fast-acordion-item>Baz</fast-accordion-item>
            </fast-accordion>
        `);

        await connect();

        expect((element as FASTAccordion).expandmode).to.equal(AccordionExpandMode.multi);
    });

    it("should set an expand mode of `single` when passed to the `expand-mode` attribute", async () => {
        const { element, connect } = await fixture(html<FASTAccordion>`
            <fast-accordion expand-mode="${AccordionExpandMode.single}">
                <fast-acordion-item>Foo</fast-accordion-item>
                <fast-acordion-item>Bar</fast-accordion-item>
                <fast-acordion-item>Baz</fast-accordion-item>
            </fast-accordion>
        `);

        await connect();

        expect((element as FASTAccordion).expandmode).to.equal(
            AccordionExpandMode.single
        );
    });

    it("should set a default expand mode of `multi` when `expand-mode` attribute is not passed", async () => {
        const { element, connect } = await fixture(html<FASTAccordion>`
            <fast-accordion>
                <fast-acordion-item>Foo</fast-accordion-item>
                <fast-acordion-item>Bar</fast-accordion-item>
                <fast-acordion-item>Baz</fast-accordion-item>
            </fast-accordion>
        `);

        await connect();

        expect((element as FASTAccordion).expandmode).to.equal(AccordionExpandMode.multi);
    });
});
