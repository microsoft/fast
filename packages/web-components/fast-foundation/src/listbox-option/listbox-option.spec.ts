import { expect } from "chai";
import { fixture } from "../fixture";
import { customElement, DOM } from "@microsoft/fast-element";
import { ListboxOption } from "./listbox-option";
import { ListboxOptionTemplate } from "../listbox-option/listbox-option.template";

@customElement({
    name: "fast-option",
    template: ListboxOptionTemplate,
})
class FASTOption extends ListboxOption {}

describe("ListboxOption", () => {
    async function setup() {
        const { element, connect, disconnect } = await fixture<FASTOption>("fast-option");

        return { element, connect, disconnect };
    }

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
});
