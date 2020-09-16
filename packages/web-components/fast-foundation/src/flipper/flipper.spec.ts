import { expect } from "chai";
import { Flipper, FlipperTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement, html } from "@microsoft/fast-element";
import { FlipperDirection } from "./flipper";

describe("Flipper", () => {
    const name = "Flipper";

    @customElement({
        name: "fast-flipper",
        template,
    })
    class FASTFlipper extends Flipper {}

    it("should include a role of button", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        await connect();

        expect(element.getAttribute("role")).to.equal("button");
    });

    it("should include an attribute of `aria-disabled` when disabled is true", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");
    });

    it("should include a tabindex of -1 when hiddenFromAT is true", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        element.hiddenFromAT = true;

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("-1");
    });

    it("should set an attribute of aria-hidden with a value of true by default", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("aria-hidden")).to.equal("true");
    });

    it("should set a default value of true for hiddenFromAT property", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        await connect();

        expect(element.hiddenFromAT).to.equal(true);
    });

    it("should set a tabindex of 0 when aria-hidden attribute is false", async () => {
        const { element, connect } = await fixture<Flipper>(
            html`
                <fast-flipper aria-hidden="false"></fast-flipper>
            `
        );

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute("tabindex")).to.equal("0");
    });

    it("should render a span with a class of `next` when direction is `next`", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        element.direction = FlipperDirection.next;

        await connect();

        expect(
            element.shadowRoot?.querySelector("span")?.classList.contains("next")
        ).to.equal(true);
    });

    it("should render a span with a class of `previous` when direction is `previous`", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        element.direction = FlipperDirection.previous;

        await connect();

        expect(
            element.shadowRoot?.querySelector("span")?.classList.contains("previous")
        ).to.equal(true);
    });

    it("should render a span with a class of `next` when direction is NOT passed", async () => {
        const { element, connect } = await fixture<Flipper>("fast-flipper");

        await connect();
        await DOM.nextUpdate();

        expect(
            element.shadowRoot?.querySelector("span")?.classList.contains("next")
        ).to.equal(true);
    });
});
