import { DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { listboxOptionTemplate } from "../listbox-option/listbox-option.template";
import { fixture } from "../test-utilities/fixture";
import { ListboxOption } from "./listbox-option";

describe("ListboxOption", () => {
    const FASTOption = ListboxOption.compose({
        baseName: "option",
        template: listboxOptionTemplate,
    });

    async function setup() {
        const { element, connect, disconnect } = await fixture(FASTOption());

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

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-selected")).to.equal("false");

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

    it("should set the `aria-checked` attribute to match the `checked` property", async () => {
        const { element, connect, disconnect } = await setup();


        await connect();

        expect(element.hasAttribute("aria-checked")).to.be.false;

        element.checked = true;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.checked = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-checked")).to.equal("false");

        element.checked = undefined;

        await DOM.nextUpdate();

        expect(element.hasAttribute("aria-checked")).to.be.false;

        await disconnect();
    });
});
