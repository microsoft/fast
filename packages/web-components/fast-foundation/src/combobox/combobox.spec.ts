import { assert, expect } from "chai";
import { DOM } from "@microsoft/fast-element";
import { listboxOptionTemplate, ListboxOption } from "../listbox-option";
import { fixture } from "../test-utilities/fixture";
import { Combobox, comboboxTemplate as template } from "./index";
import { KeyCodes } from "@microsoft/fast-web-utilities";

const FASTCombobox = Combobox.compose({
    baseName: "combobox",
    template
})

const FASTOption = ListboxOption.compose({
    baseName: "option",
    template: listboxOptionTemplate
})

async function setup() {
    const { element, connect, disconnect, parent } = await fixture(
        [FASTCombobox(), FASTOption()]
    );

    const option1 = document.createElement("fast-option") as ListboxOption;
    option1.textContent = "one";

    const option2 = document.createElement("fast-option") as ListboxOption;
    option2.textContent = "two";

    const option3 = document.createElement("fast-option") as ListboxOption;
    option3.textContent = "three";

    element.appendChild(option1);
    element.appendChild(option2);
    element.appendChild(option3);

    return { element, connect, disconnect, document, option1, option2, option3, parent };
}

// TODO: Need to add tests for keyboard handling & focus management
describe("Combobox", () => {
    it("should include a control with a role of `combobox`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        assert.strictEqual(element.control.getAttribute("role"), "combobox");

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
        element.disabled = true;

        await connect();

        expect(element.getAttribute("tabindex")).to.equal(null);

        await disconnect();
    });

    it("should NOT set its value to the first available option", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.value).to.equal("");

        await disconnect();
    });

    it("should set its value to the first option with the `selected` attribute present", async () => {
        const { element, connect, disconnect, option2 } = await setup();

        option2.setAttribute("selected", "");

        expect(option2.selected).to.be.true;

        await connect();

        expect(element.value).to.equal("two");

        await disconnect();
    });

    it("should return the same value when the value property is set before connect", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = "two";

        expect(element.value).to.equal("two");

        await connect();

        await disconnect();
    });

    it("should return the same value when the value property is set after connect", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = "two";

        expect(element.value).to.equal("two");

        await disconnect();
    });

    describe("should NOT emit a 'change' event when the value changes by user input while open", () => {
        it("via arrow down key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: "ArrowDown",
                keyCode: KeyCodes.arrowDown,
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false),
            ]);

            expect(wasChanged).to.be.false;

            await disconnect();
        });

        it("via arrow up key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = "two";

            expect(element.value).to.equal("two");

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: "ArrowUp",
                keyCode: KeyCodes.arrowUp,
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                DOM.nextUpdate().then(() => false),
            ]);

            expect(wasChanged).to.be.false;

            expect(element.value).to.equal("two");

            await disconnect();
        });
    });

    describe("should NOT emit a 'change' event when the value changes by programmatic interaction", () => {
        it("via end key", async () => {
            const { element, connect, disconnect } = await setup();

            element.value = "one";

            await connect();

            expect(element.value).to.equal("one");

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));

                    element.value = "two";
                }),
                DOM.nextUpdate().then(() => false),
            ]);

            expect(wasChanged).to.be.false;

            expect(element.value).to.equal("two");

            await disconnect();
        });
    });

    it("should set the `placeholder` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const placeholder = "placeholder";

        element.placeholder = placeholder;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".selected-value")?.getAttribute("placeholder")
        ).to.equal(placeholder);

        await disconnect();
    });

    describe("when the owning form's reset() function is invoked", () => {
        it("should reset the value property to its initial value", async () => {
            const { connect, disconnect, element, parent } = await setup();

            element.value = "one";

            const form = document.createElement("form");

            form.appendChild(element);

            parent.appendChild(form);

            await connect();

            element.value = "two";

            expect(element.value).to.equal("two");

            form.reset();

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("should reset its value property to the first option with the `selected` attribute present", async () => {
            const { element, connect, disconnect, parent, option2 } = await setup();

            option2.setAttribute("selected", "");

            const form = document.createElement("form");

            form.appendChild(element);

            parent.appendChild(form);

            await connect();

            expect(element.value).to.equal("two");

            element.value = "one";

            expect(element.value).to.equal("one");

            form.reset();

            await DOM.nextUpdate();

            expect(element.value).to.equal("two");

            await disconnect();
        });
    });
});
