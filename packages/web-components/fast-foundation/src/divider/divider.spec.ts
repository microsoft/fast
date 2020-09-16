import { expect } from "chai";
import { Divider, DividerTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";
import { DividerRole } from "./divider";

describe("Divider", () => {
    const name = "Divider";

    @customElement({
        name: "fast-divider",
        template,
    })
    class FASTDivider extends Divider {}

    it("should include a role attribute equal to the role provided", async () => {
        const { element, connect } = await fixture<Divider>("fast-divider");

        element.role = DividerRole.separator;

        await connect();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);

        element.role = DividerRole.presentation;

        await DOM.nextUpdate();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.presentation}`);
    });

    it("should include a default role of `separator` if no role is passed", async () => {
        const { element, connect } = await fixture<Divider>("fast-divider");

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);
    });
});
