import { expect } from "chai";
import { DOM } from "@microsoft/fast-element";
import { fixture } from "../test-utilities/fixture";
import { DividerRole } from "./divider.options";
import { Divider, dividerTemplate as template } from "./index";

const FASTDivider = Divider.compose({
    baseName: "divider",
    template
})

async function setup() {
    const { element, connect, disconnect } = await fixture(FASTDivider());

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
