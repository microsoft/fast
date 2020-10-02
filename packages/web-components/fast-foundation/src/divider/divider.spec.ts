import { expect } from "chai";
import { Divider, DividerTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";
import { DividerRole } from "./divider";

@customElement({
    name: "fast-divider",
    template,
})
class FASTDivider extends Divider {}

async function setup() {
    const { element, connect, disconnect } = await fixture<Divider>("fast-divider");

    return { element, connect, disconnect };
}

describe("Divider", () => {
    it("should include a role attribute equal to the role provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.role = DividerRole.separator;

        await connect();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);

        element.role = DividerRole.presentation;

        await DOM.nextUpdate();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.presentation}`);

        await disconnect();
    });

    it("should include a default role of `separator` if no role is passed", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);

        await disconnect();
    });
});
