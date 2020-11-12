import { css, customElement, DOM, elements, html } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../fixture";
import { FASTProvider } from "./index";

@customElement({
    name: "fast-provider",
    template: html`
        <slot></slot>
    `,
})
class TestProvider extends FASTProvider {}

async function setup(tag: string) {
    const { element, connect, disconnect } = await fixture<FASTProvider>(tag);

    return { element, connect, disconnect };
}

describe("FASTFoundation", () => {
    it("should resolve a FASTProvider parentProvider when there is in FASTProvider ancestor", done => {
        const parent = document.createElement("fast-provider") as FASTProvider;
        const child = document.createElement("fast-provider") as FASTProvider;

        parent.appendChild(child);
        document.body.appendChild(parent);
        window.setTimeout(() => {
            expect(child.parentProvider).to.equal(parent);
            done();
        });
    });

    it("should resolve a null parentProvider when there is no FASTProvider ancestor", async () => {
        const { element, connect, disconnect } = await setup("fast-provider");
        await connect();

        expect(element.parentProvider).to.equal(null);
        disconnect();
    });
});
