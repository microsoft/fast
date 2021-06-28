import { expect } from "chai";
import { TabPanel, tabPanelTemplate as template } from "./index";
import { fixture } from "../test-utilities/fixture";

const FASTTabPanel = TabPanel.compose({
    baseName: "tab-panel",
    template,
})

async function setup() {
    const { element, connect, disconnect } = await fixture(FASTTabPanel());

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
