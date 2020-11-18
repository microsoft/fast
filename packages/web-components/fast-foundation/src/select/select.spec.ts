import { assert, expect } from "chai";
import { customElement, DOM } from "@microsoft/fast-element";
import { ListboxOptionTemplate, ListboxOption } from "../listbox-option";
import { fixture } from "../fixture";
import { Select, SelectTemplate } from "./index";

@customElement({
    name: "fast-select",
    template: SelectTemplate,
})
class FASTSelect extends Select {}

@customElement({
    name: "fast-option",
    template: ListboxOptionTemplate,
})
class FASTOption extends ListboxOption {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTSelect>("fast-select");

    const option1 = document.createElement("fast-option") as FASTOption;
    const option2 = document.createElement("fast-option") as FASTOption;
    const option3 = document.createElement("fast-option") as FASTOption;

    option1.value = "one";
    option2.value = "two";
    option3.value = "three";

    element.appendChild(option1);
    element.appendChild(option2);
    element.appendChild(option3);

    return { element, connect, disconnect, option1, option2, option3 };
}

// TODO: Need to add tests for keyboard handling & focus management
describe("Select", () => {
    it("should include a role of `combobox`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        assert.strictEqual(element.getAttribute("role"), "combobox");

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

    it("should have a tabindex of 0 when `disabled` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should NOT have a tabindex when `disabled` is true", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.disabled = true;

        await DOM.nextUpdate();

        expect(element.getAttribute("tabindex")).to.equal(null);

        await disconnect();
    });

    describe("when the owning form's reset() function is invoked", () => {
        it("should reset the value property to the first enabled option", async () => {
            const form = document.createElement("form");
            const select = document.createElement("select") as
                | FASTSelect
                | HTMLSelectElement;

            const option1 = document.createElement("option") as
                | FASTOption
                | HTMLOptionElement;
            const option2 = document.createElement("option") as
                | FASTOption
                | HTMLOptionElement;
            option1.value = "1";
            option2.value = "2";

            select.appendChild(option1);
            select.appendChild(option2);
            form.appendChild(select);
            document.body.appendChild(form);

            select.value = "1";
            assert.strictEqual(select.value, "1");

            select.value = "2";
            assert.strictEqual(select.value, "2");

            form.reset();

            await DOM.nextUpdate();

            assert.strictEqual(select.value, "1");
        });
    });
});
