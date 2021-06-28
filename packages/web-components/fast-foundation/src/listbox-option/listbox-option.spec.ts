import { expect } from "chai";
import { fixture } from "../test-utilities/fixture";
import { DOM } from "@microsoft/fast-element";
import { ListboxOption } from "./listbox-option";
import { listboxOptionTemplate } from "../listbox-option/listbox-option.template";

const FASTOption = ListboxOption.compose({
    baseName: "option",
    template: listboxOptionTemplate,
})

describe("ListboxOption", () => {
    async function setup() {
        const { element, connect, disconnect } = await fixture(FASTOption());

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
