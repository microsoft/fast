import { customElement, DOM } from "@microsoft/fast-element";
import { assert, expect } from "chai";
import { fixture } from "../fixture";
import { ListboxOption } from "../listbox-option/listbox-option";
import { ListboxOptionTemplate as itemTemplate } from "../listbox-option/listbox-option.template";
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
    class FASTOption extends ListboxOption {}

    async function setup() {
        const { element, connect, disconnect } = await fixture<FASTListbox>(
            "fast-listbox"
        );

        const option1 = document.createElement("fast-option");
        (option1 as FASTOption).textContent = "option 1";

        const option2 = document.createElement("fast-option");
        (option2 as FASTOption).textContent = "option 2";

        const option3 = document.createElement("fast-option");
        (option3 as FASTOption).textContent = "option 3";

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

    it("should have a tabindex of 0 when `disabled` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should NOT have a tabindex when `disabled` is defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.disabled = true;

        await DOM.nextUpdate();

        assert.isNull(element.getAttribute("tabindex"));

        await disconnect();
    });
});
