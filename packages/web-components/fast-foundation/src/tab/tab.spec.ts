import { expect } from "chai";
import { FASTTab, tabTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";

const tabName = uniqueElementName();
FASTTab.define({
    name: tabName,
    template: tabTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTTab>(tabName);

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
