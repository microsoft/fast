import { expect } from "chai";
import { Updates } from "@microsoft/fast-element";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FlipperDirection } from "./flipper.options.js";
import { FASTFlipper, flipperTemplate } from "./index.js";

const flipperName = uniqueElementName();
FASTFlipper.define({
    name: flipperName,
    template: flipperTemplate()
});

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTFlipper>(flipperName);

    return { element, connect, disconnect };
}

describe("Flipper", () => {
    it("should include a role of button", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("button");

        await disconnect();
    });

    it("should include an attribute of `aria-disabled` when disabled is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        await disconnect();
    });

    it("should include a tabindex of -1 when hiddenFromAT is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.hiddenFromAT = true;

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("-1");

        await disconnect();
    });

    it("should set an attribute of aria-hidden with a value of true by default", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await Updates.next();

        expect(element.getAttribute("aria-hidden")).to.equal("true");

        await disconnect();
    });

    it("should set a default value of true for hiddenFromAT property", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.hiddenFromAT).to.equal(true);

        await disconnect();
    });

    it("should set a tabindex of 0 when aria-hidden attribute is false", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("aria-hidden", "false");

        await connect();
        await Updates.next();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should render a span with a class of `next` when direction is `next`", async () => {
        const { element, connect, disconnect } = await setup();

        element.direction = FlipperDirection.next;

        await connect();

        expect(
            element.shadowRoot?.querySelector("span")?.classList.contains("next")
        ).to.equal(true);

        await disconnect();
    });

    it("should render a span with a class of `previous` when direction is `previous`", async () => {
        const { element, connect, disconnect } = await setup();

        element.direction = FlipperDirection.previous;

        await connect();

        expect(
            element.shadowRoot?.querySelector("span")?.classList.contains("previous")
        ).to.equal(true);

        await disconnect();
    });

    it("should render a span with a class of `next` when direction is NOT passed", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        await Updates.next();

        expect(
            element.shadowRoot?.querySelector("span")?.classList.contains("next")
        ).to.equal(true);

        await disconnect();
    });
});
