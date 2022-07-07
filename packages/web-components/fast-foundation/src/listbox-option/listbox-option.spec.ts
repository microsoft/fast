import { Updates } from "@microsoft/fast-element";
import { expect } from "chai";
import { listboxOptionTemplate } from "../listbox-option/listbox-option.template.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTListboxOption } from "./listbox-option.js";

describe("ListboxOption", () => {
    const optionName = uniqueElementName();
    FASTListboxOption.define({
        name: optionName,
        template: listboxOptionTemplate(),
    });

    async function setup() {
        const { element, connect, disconnect } = await fixture<FASTListboxOption>(optionName);

        return { element, connect, disconnect };
    }

    it("should have a role of `option`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("option");

        await disconnect();
    });

    it("should set the `aria-selected` attribute equal to the `selected` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.selected = true;

        await connect();

        expect(element.getAttribute("aria-selected")).to.equal("true");

        element.selected = false;

        await Updates.next();

        expect(element.getAttribute("aria-selected")).to.equal("false");

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

    it("should set the `aria-checked` attribute to match the `checked` property", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.hasAttribute("aria-checked")).to.be.false;

        element.checked = true;

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.checked = false;

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal("false");

        element.checked = undefined;

        await Updates.next();

        expect(element.hasAttribute("aria-checked")).to.be.false;

        await disconnect();
    });

    it("should have an empty string `value` when the `value` attribute exists and is empty", async () => {
        const { connect, element, disconnect } = await setup();

        await connect();

        element.setAttribute("value", "");
        element.innerText = "hello";

        expect(element.text).to.equal("hello");

        expect(element.value).to.equal("");

        await disconnect();
    });

    it("should return the text content when the `value` attribute does not exist", async () => {
        const { connect, element, disconnect } = await setup();

        await connect();

        element.innerText = "hello";

        expect(element.text).to.equal("hello");

        expect(element.value).to.equal("hello");

        await disconnect();
    });

    it("should return the trimmed text content with the `text` property", async () => {
        const { connect, element, disconnect } = await setup();

        await connect();

        element.textContent = `
            hello
            world
        `;

        expect(element.text).to.equal("hello world");

        await disconnect();
    });

    it("should return the value as a string", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = 12345 as any;

        expect(element.value).to.equal("12345");

        expect(typeof element.value).to.equal("string");

        await disconnect();
    });
});
