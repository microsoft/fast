import { customElement } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../fixture";
import { Tab, TabTemplate as template } from "./index";

@customElement({
    name: "fast-tab",
    template,
})
class FASTTab extends Tab {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTTab>("fast-tab");

    return { element, connect, disconnect };
}

describe("Tab", () => {
    it("should have a role of `tab`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("tab");

        await disconnect();
    });

    it("should have a slot attribute of `tab`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("slot")).to.equal("tab");

        await disconnect();
    });
});
