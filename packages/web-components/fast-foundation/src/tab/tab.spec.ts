import { expect } from "chai";
import { Tab, tabTemplate as template } from "./index";
import { fixture } from "../fixture";

const FASTTab = Tab.compose({
    baseName: "tab",
    template
})

async function setup() {
    const { element, connect, disconnect } = await fixture(FASTTab());

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
