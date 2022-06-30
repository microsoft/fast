import { expect } from "chai";
import { Updates } from "@microsoft/fast-element";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { DividerRole } from "./divider.options.js";
import { FASTDivider, dividerTemplate } from "./index.js";
import { Orientation } from "@microsoft/fast-web-utilities";

const dividerName = uniqueElementName();
FASTDivider.define({
    name: dividerName,
    template: dividerTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTDivider>(dividerName);

    return { element, connect, disconnect };
}

describe("Divider", () => {
    it("should include a role attribute equal to the role provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.role = DividerRole.separator;

        await connect();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);

        element.role = DividerRole.presentation;

        await Updates.next();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.presentation}`);

        await disconnect();
    });

    it("should include a default role of `separator` if no role is passed", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await Updates.next();

        expect(element.getAttribute("role")).to.equal(`${DividerRole.separator}`);

        await disconnect();
    });

    it("should set the `aria-orientation` attribute equal to the `orientation` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.orientation = Orientation.horizontal;

        await connect();

        expect(element.getAttribute("aria-orientation")).to.equal(
            `${Orientation.horizontal}`
        );

        element.orientation = Orientation.vertical;

        await Updates.next();

        expect(element.getAttribute("aria-orientation")).to.equal(
            `${Orientation.vertical}`
        );

        await disconnect();
    });
});
