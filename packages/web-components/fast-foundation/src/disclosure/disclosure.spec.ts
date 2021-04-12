import { expect } from "chai";
import { fixture } from "../fixture";
import { customElement, DOM, html, ref } from "@microsoft/fast-element";
import { Disclosure, DisclosureTemplate as template } from "./index";

@customElement({
    name: "fast-disclosure",
    template,
})
class FastDisclosure extends Disclosure {}

async function createDisclosure() {
    const { element, connect, disconnect } = await fixture<FastDisclosure>(
        "fast-disclosure"
    );

    return { element, connect, disconnect };
}

async function macrotask() {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            resolve(void 0);
        })
    })
}

describe("Disclosure", () => {
    describe("User interaction", () => {
        it("should toggle the content using `toggle()`", async () => {
            const { element, connect, disconnect } = await createDisclosure();
            await connect();
            element.toggle();
            await macrotask();
            expect(element.expanded).to.equal(true);
            await disconnect();
        });

        it("should expand and collapse the content using `show()` and `hide()`", async () => {
            const { element, connect, disconnect } = await createDisclosure();
            await connect();
            element.show();
            await macrotask();
            expect(element.expanded).to.equal(true);
            element.hide();
            await macrotask();
            expect(element.expanded).to.equal(false);
            await disconnect();
        });
    });

    describe("Accessibility", () => {
        it("should set the `aria-controls` attribute on the internal summary element", async () => {
            const { element, connect, disconnect } = await createDisclosure();
            const ariaControls = "disclosure-content";

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("summary")
                    ?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-expanded` attribute on the internal summary element", async () => {
            const { element, connect, disconnect } = await createDisclosure();
            const ariaExpanded = true;

            element.expanded = ariaExpanded;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector("summary")
                    ?.getAttribute("aria-expanded")
            ).to.equal(ariaExpanded.toString());

            await disconnect();
        });
    });
});
