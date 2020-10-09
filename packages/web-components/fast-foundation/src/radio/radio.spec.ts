import { expect } from "chai";
import { Radio, RadioTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";

@customElement({
    name: "fast-radio",
    template,
})
class FASTRadio extends Radio {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTRadio>("fast-radio");

    return { element, connect, disconnect };
}

describe("Radio", () => {
    it("should have a role of `radio`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("radio");

        await disconnect();
    });

    it("should set the `aria-checked` attribute equal to the `checked` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.checked = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });

    it("should add a class of `checked` when checked is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.classList.contains("checked")).to.equal(true);

        await disconnect();
    });

    it("should set a default `aria-checked` value when `checked` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });

    it("should set the `aria-required` attribute equal to the `required` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.required = true;

        await connect();

        expect(element.getAttribute("aria-required")).to.equal("true");

        element.required = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-required")).to.equal("false");

        await disconnect();
    });

    it("should set a default `aria-required` value when `required` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-required")).to.equal("false");

        await disconnect();
    });

    it("should set the `aria-disabled` attribute equal to the `disabled` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        element.disabled = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-disabled")).to.equal("false");

        await disconnect();
    });

    it("should set a default `aria-disabled` value when `disabled` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("false");

        await disconnect();
    });

    it("should set the `aria-readonly` attribute equal to the `readonly` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal("true");

        element.readOnly = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-readonly")).to.equal("false");

        await disconnect();
    });

    it("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal(null);

        await disconnect();
    });

    it("should add a class of `readonly` when readonly is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.classList.contains("readonly")).to.equal(true);

        await disconnect();
    });

    it("should set a tabindex of 0 on the element", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should NOT set a tabindex when disabled is `true`", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.hasAttribute("tabindex")).to.equal(false);
        expect(element.getAttribute("tabindex")).to.equal(null);

        await disconnect();
    });

    describe("label", () => {
        it("should add a class of `label` to the internal label when default slotted content exists", async () => {
            const { element, connect, disconnect } = await setup();
            const label = document.createElement("span");
            element.appendChild(label);

            await connect();

            expect(
                element.shadowRoot?.querySelector("label")?.classList.contains("label")
            ).to.equal(true);

            await disconnect();
        });

        it("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(
                element.shadowRoot?.querySelector("label")?.classList.contains("label")
            ).to.equal(true);
            expect(
                element.shadowRoot
                    ?.querySelector("label")
                    ?.classList.contains("label__hidden")
            ).to.equal(true);

            await disconnect();
        });
    });

    describe("events", () => {
        it("should fire an event on click", async () => {
            const { element, connect, disconnect } = await setup();
            let wasClicked: boolean = false;

            await connect();

            element.addEventListener("click", e => {
                e.preventDefault();

                wasClicked = true;
            });

            await DOM.nextUpdate();

            element.click();

            expect(wasClicked).to.equal(true);

            await disconnect();
        });

        it("should fire an event when spacebar is invoked", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInvoked: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: "space",
                keyCode: KeyCodes.space,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasInvoked = true;
            });

            await DOM.nextUpdate();

            element.dispatchEvent(event);

            expect(wasInvoked).to.equal(true);

            await disconnect();
        });
    });

    describe("that is required", () => {
        it("should be invalid when not checked", async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            element.name = "name";
            element.required = true;
            element.value = "test";
            expect(element.validity.valueMissing).to.equal(true);

            await disconnect();
        });

        it("should be valid when checked", async () => {
            const { element, connect, disconnect } = await setup();
            await connect();

            element.name = "name";
            element.value = "test";
            element.required = true;
            element.checked = true;

            expect(element.validity.valueMissing).to.equal(false);

            await disconnect();
        });
    });
});
