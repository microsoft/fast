import { expect } from "chai";
import { TabPanel, TabPanelTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement, html } from "@microsoft/fast-element";

describe("TabPanel", () => {
    const name = "TabPanel";

    @customElement({
        name: "fast-tab-panel",
        template,
    })
    class FASTTabPanel extends TabPanel {}

    it("should have a role of `tabpanel`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTabPanel>(
            "fast-tab-panel"
        );

        await connect();

        expect(element.getAttribute("role")).to.equal("tabpanel");

        await disconnect();
    });

    it("should have a slot attribute of `tabpanel`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTabPanel>(
            "fast-tab-panel"
        );

        await connect();

        expect(element.getAttribute("slot")).to.equal("tabpanel");

        await disconnect();
    });
});
