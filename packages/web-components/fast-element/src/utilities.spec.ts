import { composedContains, composedParent } from "./utilities.js";
import { expect } from "chai";
import { Updates } from "./observation/update-queue.js";
import { customElement, FASTElement } from "./components/fast-element.js";
import { observable } from "./observation/observable.js";
import { html } from "./templating/template.js";
import { ref } from "./templating/ref.js";

describe("The composedParent function", () => {
    it("returns the parent of an element, if it has one", () => {
        const parent = document.createElement("div");
        const child = document.createElement("div");
        parent.appendChild(child);

        const found = composedParent(child);

        expect(found).to.equal(parent);
    });
});

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

            await Updates.next();

            expect(composedContains(parent, child.root)).to.be.true;
        });

        it("should return false if the element being tested is in a shadow DOM that is not attached to a child", async () => {
            const parent = document.createElement("div");
            const child = document.createElement("composed-contains-element") as TestElement;

            document.body.appendChild(parent);
            document.body.appendChild(child);

            await Updates.next();

            expect(composedContains(parent, child.root)).to.be.false;
        });
    });
});
