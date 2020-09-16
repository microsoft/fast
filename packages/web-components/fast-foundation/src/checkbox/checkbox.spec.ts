import { expect } from "chai";
import { Checkbox, CheckboxTemplate as template } from "./index";
import { fixture } from "../fixture";
import { DOM, customElement, html } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";

describe("Checkbox", () => {
    const name = "Checkbox";

    @customElement({
        name: "fast-checkbox",
        template,
    })
    class FASTCheckbox extends Checkbox {}

    it("should have a role of `checkbox`", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        await connect();

        expect(element.getAttribute("role")).to.equal("checkbox");
    });

    it("should set the `aria-checked` attribute equal to the `checked` value", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.checked = true;

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.checked = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("false");
    });

    it("should add a class of `checked` when checked is true", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.checked = true;

        await connect();

        expect(element.classList.contains("checked")).to.equal(true);
    });

    it("should set a default `aria-checked` value when `checked` is not defined", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("false");
    });

    it("should set the `aria-required` attribute equal to the `required` value", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.required = true;

        await connect();

        expect(element.getAttribute("aria-required")).to.equal("true");

        element.required = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-required")).to.equal("false");
    });

    it("should set a default `aria-required` value when `required` is not defined", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        await connect();

        expect(element.getAttribute("aria-required")).to.equal("false");
    });

    it("should set the `aria-disabled` attribute equal to the `disabled` value", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.disabled = true;

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("true");

        element.disabled = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-disabled")).to.equal("false");
    });

    it("should set a default `aria-disabled` value when `disabled` is not defined", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("false");
    });

    it("should set the `aria-readonly` attribute equal to the `readonly` value", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.readOnly = true;

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal("true");

        element.readOnly = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-readonly")).to.equal("false");
    });

    it("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal(null);
    });

    it("should add a class of `readonly` when readonly is true", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.readOnly = true;

        await connect();

        expect(element.classList.contains("readonly")).to.equal(true);
    });

    it("should set a tabindex of 0 on the element", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");
    });

    it("should NOT set a tabindex when disabled is `true`", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.disabled = true;

        await connect();

        expect(element.hasAttribute("tabindex")).to.equal(false);
        expect(element.getAttribute("tabindex")).to.equal(null);
    });

    it("should add a class of `indeterminate` when indeterminate is true", async () => {
        const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

        element.indeterminate = true;

        await connect();

        expect(element.classList.contains("indeterminate")).to.equal(true);
    });

    describe("label", () => {
        it("should add a class of `label` to the internal label when default slotted content exists", async () => {
            const { element, connect } = await fixture(html<FASTCheckbox>`
                <fast-checkbox><span>MyCheckbox</span></fast-checkbox>
            `);

            await connect();

            expect(
                element.shadowRoot?.querySelector("label")?.classList.contains("label")
            ).to.equal(true);
        });

        it("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async () => {
            const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");

            await connect();

            expect(
                element.shadowRoot?.querySelector("label")?.classList.contains("label")
            ).to.equal(true);
            expect(
                element.shadowRoot
                    ?.querySelector("label")
                    ?.classList.contains("label__hidden")
            ).to.equal(true);
        });
    });

    describe("events", () => {
        it("should fire an event on click", async () => {
            const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");
            let wasClicked: boolean = false;

            await connect();

            element.addEventListener("click", e => {
                e.preventDefault();

                wasClicked = true;
            });

            await DOM.nextUpdate();

            element.click();

            expect(wasClicked).to.equal(true);
        });

        it("should fire an event when spacebar is invoked", async () => {
            const { element, connect } = await fixture<FASTCheckbox>("fast-checkbox");
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
        });
    });
});
