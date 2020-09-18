import { expect } from "chai";
import { customElement, html } from "@microsoft/fast-element";
import { Disclosure } from "./disclosure";

@customElement({
    name: "test-disclosure",
    template: html`
        <slot name="invoker"></slot>
        <slot name="content"></slot>
    `,
})
class TestDisclosureElement extends Disclosure {}

const createDisclosure = () => {
    const disclosure = document.createElement("test-disclosure") as Disclosure;
    disclosure.innerHTML = `
        <button slot="invoker">invoker</button>
        <div>content</div>
    `;
    document.body.appendChild(disclosure);
    return disclosure;
};

describe("Disclosure", () => {
    describe("User interaction", () => {
        it("opens a invoker on click", () => {
            const disclosure = createDisclosure();
            const invoker = document.querySelector("[slot=invoker]") as HTMLSlotElement;
            invoker.dispatchEvent(new Event("click"));
            expect(disclosure.expanded).to.equal(true);
        });

        it("should toggle the content using `toggle()`", async () => {
            const disclosure = createDisclosure();
            disclosure.toggle();
            expect(disclosure.expanded).to.equal(true);
        });

        it("should expand and collapse the content using `show()` and `hide()`", async () => {
            const disclosure = createDisclosure();
            disclosure.show();
            expect(disclosure.expanded).to.equal(true);
            disclosure.hide();
            expect(disclosure.expanded).to.equal(false);
        });
    });

    describe("Invoker", () => {
        it("links id of content items to invoker via [aria-controls]", () => {
            createDisclosure();
            const invoker = document.querySelector("[slot=invoker]") as HTMLSlotElement;
            const content = document.querySelector("div") as HTMLDivElement;
            expect(invoker.getAttribute("aria-controls")).to.equal(content.id);
        });

        it('adds aria-expanded="true" to invoker when its content is expanded', () => {
            const disclosure = createDisclosure();
            disclosure.expanded = true;
            const invoker = document.querySelector("[slot=invoker]") as HTMLSlotElement;
            expect(invoker.getAttribute("aria-expanded")).to.equal("true");
        });
    });

    describe("Contents", () => {
        it("adds aria-labelledby referring to invoker id", async () => {
            createDisclosure();
            const invoker = document.querySelector("[slot=invoker]") as HTMLSlotElement;
            const content = document.querySelector("div") as HTMLDivElement;
            expect(content.getAttribute("aria-labelledby")).to.equal(invoker.id);
        });
    });
});
