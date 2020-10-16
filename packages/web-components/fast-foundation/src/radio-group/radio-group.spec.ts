import { customElement, DOM, html } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { fixture } from "../fixture";
import { RadioTemplate as itemTemplate, Radio } from "../radio";
import { RadioGroup, RadioGroupTemplate as template } from "./index";

@customElement({
    name: "fast-radio-group",
    template,
})
class FASTRadioGroup extends RadioGroup {}

// TODO: Need to add tests for keyboard handling & focus management
describe("Radio Group", () => {
    @customElement({
        name: "fast-radio",
        template: itemTemplate,
    })
    class FASTRadio extends Radio {}

    async function setup() {
        const { element, connect, disconnect } = await fixture<FASTRadioGroup>(
            "fast-radio-group"
        );

        const radio1 = document.createElement("fast-radio");
        const radio2 = document.createElement("fast-radio");
        const radio3 = document.createElement("fast-radio");

        (radio1 as FASTRadio).className = "one";
        (radio2 as FASTRadio).className = "two";
        (radio3 as FASTRadio).className = "three";

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        return { element, connect, disconnect, radio1, radio2, radio3 };
    }

    it("should have a role of `radiogroup`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("radiogroup");

        await disconnect();
    });

    it("should set a `horizontal` class on the 'positioning-region' when an orientation of `horizontal` is provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.orientation = Orientation.horizontal;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector(".positioning-region")
                ?.classList.contains("horizontal")
        ).to.equal(true);

        await disconnect();
    });

    it("should set a `vertical` class on the 'positioning-region' when an orientation of `vertical` is provided", async () => {
        const { element, connect, disconnect } = await setup();

        element.orientation = Orientation.vertical;

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector(".positioning-region")
                ?.classList.contains("vertical")
        ).to.equal(true);

        await disconnect();
    });

    it("should set a default class on the 'positioning-region' of `horizontal` when no orientation is provided", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(
            element.shadowRoot
                ?.querySelector(".positioning-region")
                ?.classList.contains("horizontal")
        ).to.equal(true);

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

    it("should NOT set a default `aria-disabled` value when `disabled` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal(null);

        await disconnect();
    });

    it("should set all child radio elements to disabled when the`disabled` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        element.disabled = true;

        await connect();
        await DOM.nextUpdate();

        expect((element.querySelector(".one") as FASTRadio).disabled).to.equal(true);
        expect((element.querySelector(".two") as FASTRadio).disabled).to.equal(true);
        expect((element.querySelector(".three") as FASTRadio).disabled).to.equal(true);

        expect(element.querySelector(".one")?.getAttribute("aria-disabled")).to.equal(
            "true"
        );
        expect(element.querySelector(".two")?.getAttribute("aria-disabled")).to.equal(
            "true"
        );
        expect(element.querySelector(".three")?.getAttribute("aria-disabled")).to.equal(
            "true"
        );

        await disconnect();
    });

    it("should set the `aria-readonly` attribute equal to the `readonly` value", async () => {
        const { element, connect, disconnect } = await fixture<FASTRadioGroup>(
            "fast-radio-group"
        );

        element.readOnly = true;

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal("true");

        element.readOnly = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-readonly")).to.equal("false");

        await disconnect();
    });

    it("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
        const { element, connect, disconnect } = await fixture<FASTRadioGroup>(
            "fast-radio-group"
        );

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal(null);

        await disconnect();
    });

    it("should set all child radio elements to readonly when the`readonly` is passed", async () => {
        const { element, connect, disconnect } = await setup();
        element.readOnly = true;

        await connect();
        await DOM.nextUpdate();

        expect((element.querySelector(".one") as FASTRadio).readOnly).to.equal(true);
        expect((element.querySelector(".two") as FASTRadio).readOnly).to.equal(true);
        expect((element.querySelector(".three") as FASTRadio).readOnly).to.equal(true);

        expect(element.querySelector(".one")?.getAttribute("aria-readonly")).to.equal(
            "true"
        );
        expect(element.querySelector(".two")?.getAttribute("aria-readonly")).to.equal(
            "true"
        );
        expect(element.querySelector(".three")?.getAttribute("aria-readonly")).to.equal(
            "true"
        );

        await disconnect();
    });

    it("should set tabindex of 0 to a child radio with a matching `value`", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTRadioGroup>`
            <fast-radio-group value="baz">
                <fast-radio value="foo">Foo</fast-radio>
                <fast-radio value="bar">Bar</fast-radio>
                <fast-radio value="baz">Baz</fast-radio>
            </fast-radio-group>
        `);

        await connect();
        await DOM.nextUpdate();

        expect(
            element.querySelectorAll("fast-radio")[2].getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should NOT set tabindex of 0 to a child radio if its value does not match the radiogroup `value`", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTRadioGroup>`
            <fast-radio-group value="baz">
                <fast-radio value="foo">Foo</fast-radio>
                <fast-radio value="bar">Bar</fast-radio>
                <fast-radio value="baz">Baz</fast-radio>
            </fast-radio-group>
        `);

        await connect();
        await DOM.nextUpdate();

        expect(
            element.querySelectorAll("fast-radio")[0].getAttribute("tabindex")
        ).to.equal("-1");
        expect(
            element.querySelectorAll("fast-radio")[1].getAttribute("tabindex")
        ).to.equal("-1");

        await disconnect();
    });

    it("should set a child radio with a matching `value` to `checked`", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTRadioGroup>`
            <fast-radio-group value="baz">
                <fast-radio value="foo">Foo</fast-radio>
                <fast-radio value="bar">Bar</fast-radio>
                <fast-radio value="baz">Baz</fast-radio>
            </fast-radio-group>
        `);

        await connect();
        await DOM.nextUpdate();

        expect((element.querySelectorAll("fast-radio")[2] as FASTRadio).checked).to.equal(
            true
        );
        expect(
            element.querySelectorAll("fast-radio")[2].getAttribute("aria-checked")
        ).to.equal("true");

        await disconnect();
    });

    it("should mark the last radio defaulted to checked as checked, the rest should not be checked", async () => {
        const { element, connect, disconnect } = await fixture(html`
            <fast-radio-group>
                <fast-radio value="foo">Foo</fast-radio>
                <fast-radio value="bar" checked>Bar</fast-radio>
                <fast-radio value="baz" checked>Baz</fast-radio>
            </fast-radio-group>
        `);

        await connect();
        await DOM.nextUpdate();

        const radios: NodeList = element.querySelectorAll("fast-radio");
        expect((radios[2] as HTMLInputElement).checked).to.equal(true);
        expect((radios[1] as HTMLInputElement).checked).to.equal(false);
    });

    it("should mark radio matching value on radio-group over any checked attributes", async () => {
        const { element, connect, disconnect } = await fixture(html`
            <fast-radio-group value="bar">
                <fast-radio value="foo">Foo</fast-radio>
                <fast-radio value="bar" checked>Bar</fast-radio>
                <fast-radio value="baz" checked>Baz</fast-radio>
            </fast-radio-group>
        `);

        await connect();
        await DOM.nextUpdate();

        const radios: NodeList = element.querySelectorAll("fast-radio");
        expect((radios[2] as HTMLInputElement).checked).to.equal(false);
        expect((radios[1] as HTMLInputElement).checked).to.equal(true);
        // radio-group explicitly sets non-matching radio's checked to false if a value match was found
        expect((radios[2] as HTMLInputElement).hasAttribute("checked")).to.equal(false);
    });

    it("should NOT set a child radio to `checked` if its value does not match the radiogroup `value`", async () => {
        const { element, connect, disconnect } = await fixture(html<FASTRadioGroup>`
            <fast-radio-group value="baz">
                <fast-radio value="foo">Foo</fast-radio>
                <fast-radio value="bar">Bar</fast-radio>
                <fast-radio value="baz">Baz</fast-radio>
            </fast-radio-group>
        `);

        await connect();
        await DOM.nextUpdate();

        expect((element.querySelectorAll("fast-radio")[0] as FASTRadio).checked).to.equal(
            false
        );
        expect(
            element.querySelectorAll("fast-radio")[0].getAttribute("aria-checked")
        ).to.equal("false");

        expect((element.querySelectorAll("fast-radio")[1] as FASTRadio).checked).to.equal(
            false
        );
        expect(
            element.querySelectorAll("fast-radio")[1].getAttribute("aria-checked")
        ).to.equal("false");

        await disconnect();
    });
});
