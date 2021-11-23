import { DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { ListboxOption } from "../listbox-option/listbox-option";
import { listboxOptionTemplate as itemTemplate } from "../listbox-option/listbox-option.template";
import { fixture } from "../test-utilities/fixture";
import { ListboxElement, listboxTemplate as template } from "./index";

const FASTListbox = ListboxElement.compose({
    baseName: "listbox",
    template
})

// TODO: Need to add tests for keyboard handling & focus management
describe("Listbox", () => {
    const FASTOption = ListboxOption.compose({
        baseName: "option",
        template: itemTemplate
    })

    async function setup() {
        const { element, connect, disconnect } = await fixture([FASTListbox(), FASTOption()]);

        const option1 = document.createElement("fast-option");
        (option1 as ListboxOption).textContent = "option 1";

        const option2 = document.createElement("fast-option");
        (option2 as ListboxOption).textContent = "option 2";

        const option3 = document.createElement("fast-option");
        (option3 as ListboxOption).textContent = "option 3";

        element.appendChild(option1);
        element.appendChild(option2);
        element.appendChild(option3);

        return { element, connect, disconnect, option1, option2, option3 };
    }

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

        expect(element.getAttribute("tabindex")).to.be.null;

        await disconnect();
    });

    it("should select the first option when no options have the `selected` attribute", async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();

        await connect();

        expect(element.selectedIndex).to.equal(0);

        expect(element.selectedOptions).to.contain(option1);
        expect(element.selectedOptions).to.not.contain(option2);
        expect(element.selectedOptions).to.not.contain(option3);

        await disconnect();
    });

    it("should select the option with a `selected` attribute", async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();

        option2.setAttribute("selected", "");

        await connect();

        expect(element.selectedIndex).to.equal(1);

        expect(element.selectedOptions).to.not.contain(option1);
        expect(element.selectedOptions).to.contain(option2);
        expect(element.selectedOptions).to.not.contain(option3);

        await disconnect();
    });

    it("should set the `size` property to match the `size` attribute", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.setAttribute("size", "4");

        expect(element.size).to.equal(4);

        await disconnect();
    });

    it("should set the `size` attribute to match the `size` property", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.size = 4;

        await DOM.nextUpdate();

        expect(element.getAttribute("size")).to.equal("4");

        await disconnect();
    });

    describe("should set the `size` property to 0 when a negative value is set", () => {
        it("via the `size` property", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.size = 1;

            await DOM.nextUpdate();

            expect(element.size).to.equal(1);
            expect(element.getAttribute("size")).to.equal("1");

            element.size = -1;

            await DOM.nextUpdate();

            expect(element.size).to.equal(0);
            expect(element.getAttribute("size")).to.equal("0");

            await disconnect();
        });

        it("via the `size` attribute", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.setAttribute("size", "1");

            expect(element.size).to.equal(1);
            expect(element.getAttribute("size")).to.equal("1");

            element.setAttribute("size", "-1");

            await DOM.nextUpdate();

            expect(element.size).to.equal(0);
            expect(element.getAttribute("size")).to.equal("0");

            await disconnect();
        });
    });
});
