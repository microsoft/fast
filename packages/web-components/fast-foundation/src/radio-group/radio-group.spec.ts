import { Updates } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { assert, expect } from "chai";
import { Radio, radioTemplate as itemTemplate } from "../radio/index.js";
import { fixture } from "../testing/fixture.js";
import { RadioGroup, radioGroupTemplate as template } from "./index.js";

const FASTRadioGroup = RadioGroup.compose({
    baseName: "radio-group",
    template,
})

const FASTRadio = Radio.compose({
    baseName: "radio",
    template,
})

// TODO: Need to add tests for keyboard handling & focus management
describe("Radio Group", () => {
    const FASTRadio = Radio.compose({
        baseName: "radio",
        template: itemTemplate
    })

    async function setup() {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        return { element, connect, disconnect, parent, radio1, radio2, radio3 };
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

        await Updates.next();

        expect(element.getAttribute("aria-disabled")).to.equal("false");

        await disconnect();
    });

    it("should NOT set a default `aria-disabled` value when `disabled` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal(null);

        await disconnect();
    });

    it("should set all child radio elements to disabled when the `disabled` attribute is present", async () => {
        const { element, connect, disconnect, radio1, radio2, radio3 } = await setup();
        element.disabled = true;

        await connect();
        await Updates.next();

        expect(radio1.disabled).to.equal(true);
        expect(radio2.disabled).to.equal(true);
        expect(radio3.disabled).to.equal(true);

        expect(radio1.getAttribute("aria-disabled")).to.equal("true");
        expect(radio2.getAttribute("aria-disabled")).to.equal("true");
        expect(radio3.getAttribute("aria-disabled")).to.equal("true");

        await disconnect();
    });

    it("should set the `aria-readonly` attribute equal to the `readonly` value", async () => {
        const { element, connect, disconnect } = await fixture(FASTRadioGroup());

        element.readOnly = true;

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal("true");

        element.readOnly = false;

        await Updates.next();

        expect(element.getAttribute("aria-readonly")).to.equal("false");

        await disconnect();
    });

    it("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
        const { element, connect, disconnect } = await fixture(FASTRadioGroup());

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal(null);

        await disconnect();
    });

    it("should set all child radio elements to readonly when the`readonly` is passed", async () => {
        const { element, connect, disconnect, radio1, radio2, radio3 } = await setup();
        element.readOnly = true;

        await connect();
        await Updates.next();

        expect(radio1.readOnly).to.equal(true);
        expect(radio2.readOnly).to.equal(true);
        expect(radio3.readOnly).to.equal(true);

        expect(radio1.getAttribute("aria-readonly")).to.equal("true");
        expect(radio2.getAttribute("aria-readonly")).to.equal("true");
        expect(radio3.getAttribute("aria-readonly")).to.equal("true");

        await disconnect();
    });

    it("should set tabindex of 0 to a child radio with a matching `value`", async () => {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        element.value = "baz";

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        radio1.value = "foo";
        radio2.value = "bar";
        radio3.value = "baz";

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect()
        await Updates.next();

        expect(
            element.querySelectorAll("fast-radio")[2].getAttribute("tabindex")
        ).to.equal("0");

        await disconnect();
    });

    it("should NOT set tabindex of 0 to a child radio if its value does not match the radiogroup `value`", async () => {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        element.value = "baz";

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        radio1.value = "foo";
        radio2.value = "bar";
        radio3.value = "baz";

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await Updates.next();

        expect(
            element.querySelectorAll("fast-radio")[0].getAttribute("tabindex")
        ).to.equal("-1");
        expect(
            element.querySelectorAll("fast-radio")[1].getAttribute("tabindex")
        ).to.equal("-1");

        await disconnect();
    });

    it("should set a child radio with a matching `value` to `checked`", async () => {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        element.value = "baz";

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        radio1.value = "foo";
        radio2.value = "bar";
        radio3.value = "baz";

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await Updates.next();

        expect((element.querySelectorAll("fast-radio")[2] as Radio).checked).to.equal(
            true
        );
        expect(
            element.querySelectorAll("fast-radio")[2].getAttribute("aria-checked")
        ).to.equal("true");

        await disconnect();
    });

    it("should set a child radio with a matching `value` to `checked` when value changes", async () => {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        element.value = "baz";

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        radio1.value = "foo";
        radio2.value = "bar";
        radio3.value = "baz";

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await Updates.next();

        element.value = "foo";

        await Updates.next();

        expect((element.querySelectorAll("fast-radio")[0] as Radio).checked).to.equal(
            true
        );
        expect(
            element.querySelectorAll("fast-radio")[0].getAttribute("aria-checked")
        ).to.equal("true");

        await disconnect();
    });

    it("should mark the last radio defaulted to checked as checked, the rest should not be checked", async () => {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        radio1.value = "foo";
        radio2.value = "bar";
        radio3.value = "baz";

        radio2.setAttribute("checked","");
        radio3.setAttribute("checked","");

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await Updates.next();

        const radios: NodeList = element.querySelectorAll("fast-radio");
        expect((radios[2] as HTMLInputElement).checked).to.equal(true);
        expect((radios[1] as HTMLInputElement).checked).to.equal(false);

        await disconnect();
    });

    it("should mark radio matching value on radio-group over any checked attributes", async () => {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        element.value = "bar";

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        radio1.value = "foo";
        radio2.value = "bar";
        radio3.value = "baz";

        radio2.setAttribute("checked","");
        radio3.setAttribute("checked","");

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await Updates.next();

        const radios: NodeList = element.querySelectorAll("fast-radio");
        expect((radios[1] as HTMLInputElement).checked).to.equal(true);

        // radio-group explicitly sets non-matching radio's checked to false if a value match was found,
        // but the attribute should still persist.
        expect((radios[2] as HTMLInputElement).hasAttribute("checked")).to.equal(true);
        expect((radios[2] as HTMLInputElement).checked).to.equal(false);

        await disconnect();
    });

    it("should NOT set a child radio to `checked` if its value does not match the radiogroup `value`", async () => {
        const { element, connect, disconnect, parent } = await fixture([FASTRadioGroup(), FASTRadio()]);

        element.value = "baz";

        const radio1 = document.createElement("fast-radio") as Radio;
        const radio2 = document.createElement("fast-radio") as Radio;
        const radio3 = document.createElement("fast-radio") as Radio;

        radio1.className = "one";
        radio2.className = "two";
        radio3.className = "three";

        radio1.value = "foo";
        radio2.value = "bar";
        radio3.value = "baz";

        element.appendChild(radio1);
        element.appendChild(radio2);
        element.appendChild(radio3);

        await connect();
        await Updates.next();

        expect((element.querySelectorAll("fast-radio")[0] as Radio).checked).to.equal(
            false
        );
        expect(
            element.querySelectorAll("fast-radio")[0].getAttribute("aria-checked")
        ).to.equal("false");

        expect((element.querySelectorAll("fast-radio")[1] as Radio).checked).to.equal(
            false
        );
        expect(
            element.querySelectorAll("fast-radio")[1].getAttribute("aria-checked")
        ).to.equal("false");

        await disconnect();
    });

    it("should allow resetting of elements by the parent form", async () => {
        const {
            element,
            connect,
            disconnect,
            parent,
            radio1,
            radio2,
            radio3,
        } = await setup();

        radio2.setAttribute("checked", "");

        const form = document.createElement("form");
        form.appendChild(element);
        parent.appendChild(form);

        await connect();

        radio1.checked = true;

        assert.isTrue(!!radio1.checked);
        assert.isFalse(!!radio2.checked);
        assert.isFalse(!!radio3.checked);

        form.reset();

        assert.isFalse(!!radio1.checked);
        assert.isTrue(!!radio2.checked);
        assert.isFalse(!!radio3.checked);

        await disconnect();
    });
});
