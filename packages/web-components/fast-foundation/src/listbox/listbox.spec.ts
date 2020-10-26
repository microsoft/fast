import { expect } from "chai";
import { customElement, DOM, html } from "@microsoft/fast-element";
import { OptionTemplate as itemTemplate, Option } from "../option";
import { fixture } from "../fixture";
import { Listbox, ListboxTemplate as template } from "./index";

@customElement({
    name: "fast-listbox",
    template,
})
class FASTListbox extends Listbox {}

// TODO: Need to add tests for keyboard handling & focus management
describe("Listbox", () => {
    @customElement({
        name: "fast-option",
        template: itemTemplate,
    })
    class FASTOption extends Option {}

    async function setup() {
        const { element, connect, disconnect } = await fixture<FASTListbox>(
            "fast-listbox"
        );

        const option1 = document.createElement("fast-option");
        const option2 = document.createElement("fast-option");
        const option3 = document.createElement("fast-option");

        (option1 as FASTOption).className = "one";
        (option2 as FASTOption).className = "two";
        (option3 as FASTOption).className = "three";

        element.appendChild(option1);
        element.appendChild(option2);
        element.appendChild(option3);

        return { element, connect, disconnect, option1, option2, option3 };
    }

    it("should have a role of `listbox`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("listbox");

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
});
