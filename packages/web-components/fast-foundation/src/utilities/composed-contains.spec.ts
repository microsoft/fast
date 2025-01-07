import { composedContains } from "./composed-contains";
import { expect } from "chai";
import { html, customElement, ref, FASTElement, observable, DOM } from "@ni/fast-element";

@customElement({
    name: "composed-contains-element",
    template: html<TestElement>`
        <div ${ref("root")} data-foo="bar"><slot></slot></div>
    `
})
class TestElement extends FASTElement {
    @observable
    public root: HTMLElement;
}

describe("The composedContains function", () => {
    it("returns true if the test and reference are the same element", () => {
        // This matches the behavior of Node.contains()
        const target = document.createElement("div");

        expect(composedContains(target, target)).to.be.true;
    });

    describe("that are in the same DOM", () => {
        it("returns true if the test is a child of the reference", () => {
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);

            expect(composedContains(parent, child)).to.be.true;
        });
        it("returns false if the test is not a child of the reference", () => {
            const parent = document.createElement("div");
            const child = document.createElement("div");
            parent.appendChild(child);

            expect(composedContains(child, parent)).to.be.false;
        });
    });

    describe("that are not in the same DOM", () => {
        it("should return true if the element being tested is in a shadow DOM of a child element", async () => {
            const parent = document.createElement("div");
            const child = document.createElement("composed-contains-element") as TestElement;

            parent.appendChild(child);
            document.body.appendChild(parent);

            await DOM.nextUpdate();

            expect(composedContains(parent, child.root)).to.be.true;
        });

        it("should return false if the element being tested is in a shadow DOM that is not attached to a child", async () => {
            const parent = document.createElement("div");
            const child = document.createElement("composed-contains-element") as TestElement;

            document.body.appendChild(parent);
            document.body.appendChild(child);

            await DOM.nextUpdate();

            expect(composedContains(parent, child.root)).to.be.false;
        });
    });
});
