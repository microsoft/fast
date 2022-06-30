import { expect } from "chai";
import { FASTTabPanel, tabPanelTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";

const tabPanelName = uniqueElementName();
FASTTabPanel.define({
    name: tabPanelName,
    template: tabPanelTemplate(),
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTTabPanel>(tabPanelName);

    return { element, connect, disconnect };
}

describe("TabPanel", () => {
    it("should have a role of `tabpanel`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("tabpanel");

        await disconnect();
    });

    it("should have a slot attribute of `tabpanel`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("slot")).to.equal("tabpanel");

        await disconnect();
    });
});
