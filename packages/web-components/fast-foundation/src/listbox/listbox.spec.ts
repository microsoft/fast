import { DOM } from "@microsoft/fast-element";
import { expect } from "chai";
import { ListboxOption } from "../listbox-option/listbox-option";
import { listboxOptionTemplate as itemTemplate } from "../listbox-option/listbox-option.template";
import { fixture } from "../test-utilities/fixture";
import { ListboxElement, listboxTemplate as template } from "./index";

describe("Listbox", () => {
    const FASTListbox = ListboxElement.compose({
        baseName: "listbox",
        template
    });

    const FASTOption = ListboxOption.compose({
        baseName: "option",
        template: itemTemplate
    });

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

    it("should set the `selectedIndex` to match the selected option after connection", async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();

        await connect();

        expect(element.selectedIndex).to.equal(0);

        option2.setAttribute("selected", "");

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

    it("should set the `aria-setsize` and `aria-posinset` properties on slotted options", async () => {
        const { connect, disconnect, option1, option2, option3 } = await setup();

        await connect();

        await DOM.nextUpdate();

        expect(option1.getAttribute("aria-posinset")).to.equal("1");
        expect(option1.getAttribute("aria-setsize")).to.equal("3");

        expect(option2.getAttribute("aria-posinset")).to.equal("2");
        expect(option2.getAttribute("aria-setsize")).to.equal("3");

        expect(option3.getAttribute("aria-posinset")).to.equal("3");
        expect(option3.getAttribute("aria-setsize")).to.equal("3");

        await disconnect();
    });

    it("should set a unique ID for each slotted option without an ID", async () => {
        const { connect, disconnect, option1, option2, option3 } = await setup();

        option2.id = "unique-id";

        await connect();

        await DOM.nextUpdate();

        expect(option1.id).to.match(/option-\d+/);

        expect(option2.id).to.equal("unique-id");

        expect(option3.id).to.match(/option-\d+/);

        await disconnect();
    });

    it("should set the `aria-activedescendant` property to the ID of the currently selected option", async () => {
        const { connect, disconnect, element, option1, option2, option3 } = await setup();

        await connect();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-activedescendant")).to.exist.and.equal(option1.id);

        element.selectNextOption();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-activedescendant")).to.equal(option2.id);

        element.selectNextOption();

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-activedescendant")).to.equal(option3.id);

        await disconnect();
    });

    it("should set the `aria-multiselectable` attribute to match the `multiple` attribute", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.multiple = true;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-multiselectable")).to.equal("true");

        element.multiple = false;

        await DOM.nextUpdate();

        expect(element.getAttribute("aria-multiselectable")).to.not.exist;

        await disconnect();
    });
});
