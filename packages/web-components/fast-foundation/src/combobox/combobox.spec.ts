import { Updates } from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { FASTListboxOption, listboxOptionTemplate } from "../listbox-option/index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTCombobox, comboboxTemplate } from "./index.js";

describe("Combobox", () => {
    const Combobox = FASTCombobox.define({
        name: uniqueElementName("combobox"),
        template: comboboxTemplate()
    });

    const Option = FASTListboxOption.define({
        name: uniqueElementName("option"),
        template: listboxOptionTemplate()
    });

    async function setup() {
        const { element, connect, disconnect, parent } = await fixture(Combobox);

        element.id = "combobox";

        const option1 = new Option();
        option1.textContent = "one";

        const option2 = new Option();
        option2.textContent = "two";

        const option3 = new Option();
        option3.textContent = "three";

        element.appendChild(option1);
        element.appendChild(option2);
        element.appendChild(option3);

        return { element, connect, disconnect, document, option1, option2, option3, parent };
    }

    it("should include a control with a role of `combobox`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.control).to.exist;

        expect(element.control.getAttribute("role")).to.equal("combobox");

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

    it("should display the listbox when the `open` property is true before connecting", async () => {
        const { element, connect, disconnect } = await setup();

        element.open = true;

        await connect();

        expect(element.hasAttribute("open")).to.be.true;

        await disconnect();
    });

    describe("should NOT emit a 'change' event when the value changes by user input while open", () => {
        it("via arrow down key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: keyArrowDown,
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                Updates.next().then(() => false),
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
                key: keyArrowUp,
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                Updates.next().then(() => false),
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
                Updates.next().then(() => false),
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

            await Updates.next();

            expect(element.value).to.equal("two");

            await disconnect();
        });
    });

    it("should focus the control when an associated label is clicked", async () => {
        const { element, connect, disconnect, parent } = await setup();

        const label = document.createElement("label");
        label.setAttribute("for", element.id);

        parent.insertBefore(label, element);

        await connect();

        expect(element.labels).to.contain(label);

        label.click();

        expect(document.activeElement).to.equal(element);

        await disconnect();
    });

    it("should set the control's `aria-activedescendant` property to the ID of the currently selected option while open", async () => {
        const { connect, disconnect, element, option1, option2, option3 } = await setup();

        await connect();

        await Updates.next();

        expect(element.control).to.exist;

        expect(option1.id).to.exist;

        expect(option2.id).to.exist;

        expect(option3.id).to.exist;

        expect(element.control.getAttribute("aria-activedescendant")).to.be.null;

        element.open = true;

        await Updates.next();

        expect(element.control.getAttribute("aria-activedescendant")).to.exist.and.be.empty;

        element.selectNextOption();

        await Updates.next();

        expect(element.control.getAttribute("aria-activedescendant")).to.equal(option1.id);

        element.selectNextOption();

        await Updates.next();

        expect(element.control.getAttribute("aria-activedescendant")).to.equal(option2.id);

        element.selectNextOption();

        await Updates.next();

        expect(element.control.getAttribute("aria-activedescendant")).to.equal(option3.id);

        element.value = "other";

        await Updates.next();

        expect(element.control.getAttribute("aria-activedescendant")).to.be.empty;

        await disconnect();
    });

    it("should set the control's `aria-controls` attribute to the ID of the internal listbox element while open", async () => {
        const { connect, disconnect, element } = await setup();

        await connect();

        expect(element.control).to.exist;

        expect(element.listbox).to.exist;

        const listboxId = element.listbox.id;

        expect(element.control.getAttribute("aria-controls")).to.exist;

        expect(element.control.getAttribute("aria-controls")).to.be.empty;

        element.open = true;

        await Updates.next();

        expect(element.control.getAttribute("aria-controls")).to.equal(listboxId);

        element.open = false;

        await Updates.next();

        expect(element.control.getAttribute("aria-controls")).to.be.empty;

        await disconnect();
    });
});
