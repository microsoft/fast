import { expect } from "chai";
import { Tab, TabTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement, html } from "@microsoft/fast-element";

describe("Tab", () => {
    const name = "Tab";

    @customElement({
        name: "fast-tab",
        template,
    })
    class FASTTab extends Tab {}

    it("should have a role of `tab`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTab>("fast-tab");

        await connect();

        expect(element.getAttribute("role")).to.equal("tab");

        await disconnect();
    });

    it("should have a slot attribute of `tab`", async () => {
        const { element, connect, disconnect } = await fixture<FASTTab>("fast-tab");

        await connect();

        expect(element.getAttribute("slot")).to.equal("tab");

        await disconnect();
    });
});