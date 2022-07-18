import { DOM } from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp, keyEnter } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { ListboxOption, listboxOptionTemplate } from "../listbox-option";
import { fixture } from "../test-utilities/fixture";
import { Combobox, ComboboxAutocomplete, comboboxTemplate as template } from "./index";

describe("Combobox", () => {
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

        element.id = "combobox";

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

    it("should display the listbox when the `open` property is true before connecting", async () => {
        const { element, connect, disconnect } = await setup();

        element.open = true;

        await connect();

        expect(element.hasAttribute("open")).to.be.true;

        await disconnect();
    });

    it("should NOT emit a 'change' event when the user presses Enter without changing value", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = "two";

        const event = new KeyboardEvent("keydown", {
            key: keyEnter,
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

    it("should update value to entered non-option value after selecting an option value", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = "two";

        const enterEvent = new KeyboardEvent("keydown", {
            key: keyEnter,
        } as KeyboardEventInit);

        const wasChanged = await Promise.race([
            new Promise(resolve => {
                element.addEventListener("change", () => resolve(true));

                // fake a key entered value
                (element as Combobox).control.value = 'a';
                (element as Combobox).control.dispatchEvent(new InputEvent('input', { data: 'a', inputType: 'insertText' }));

                element.dispatchEvent(enterEvent);
            }),
            DOM.nextUpdate().then(() => false),
        ]);

        expect(wasChanged).to.be.true;
        expect((element as Combobox).value).to.equal('a');

        await disconnect();

    });

    it("should emit a 'change' event when the user clicks away after selecting option in dropdown", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.click(); // open dropdown

        const keyDownEvent = new KeyboardEvent("keydown", {
            key: keyArrowDown,
        } as KeyboardEventInit);
        element.dispatchEvent(keyDownEvent);
        DOM.nextUpdate();

        const wasChanged = await Promise.race([
            new Promise(resolve => {
                element.addEventListener("change", () => resolve(true));

                // fake focusout handling
                element.dispatchEvent(new FocusEvent('focusout', { relatedTarget: element }));
            }),
            DOM.nextUpdate().then(() => false),
        ]);

        expect(wasChanged).to.be.true;

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
                key: keyArrowUp,
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

        await DOM.nextUpdate();

        expect(element.control).to.exist;

        expect(option1.id).to.exist;

        expect(option2.id).to.exist;

        expect(option3.id).to.exist;

        expect(element.control.getAttribute("aria-activedescendant")).to.be.null;

        element.open = true;

        await DOM.nextUpdate();

        expect(element.control.getAttribute("aria-activedescendant")).to.exist.and.be.empty;

        element.selectNextOption();

        await DOM.nextUpdate();

        expect(element.control.getAttribute("aria-activedescendant")).to.equal(option1.id);

        element.selectNextOption();

        await DOM.nextUpdate();

        expect(element.control.getAttribute("aria-activedescendant")).to.equal(option2.id);

        element.selectNextOption();

        await DOM.nextUpdate();

        expect(element.control.getAttribute("aria-activedescendant")).to.equal(option3.id);

        element.value = "other";

        await DOM.nextUpdate();

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

        await DOM.nextUpdate();

        expect(element.control.getAttribute("aria-controls")).to.equal(listboxId);

        element.open = false;

        await DOM.nextUpdate();

        expect(element.control.getAttribute("aria-controls")).to.be.empty;

        await disconnect();
    });

    const noInlineAutocompleteModes: ComboboxAutocomplete[] = [ "none", "list" ];
    noInlineAutocompleteModes.forEach(mode => {
        it(`when autocomplete is ${mode}, typing should select exact match`, async () => {
            const { connect, disconnect, element, option2, option3 } = await setup();

            await connect();

            (element as Combobox).autocomplete = mode;

            expect(option2.selected).to.be.false;

            // fake a key entered value
            (element as Combobox).control.value = 't';
            (element as Combobox).control.dispatchEvent(new InputEvent('input', { data: 't', inputType: 'insertText' }));

            expect(option2.selected).to.be.false; // 'two' not selected
            expect(option3.selected).to.be.false; // 'three' not selected

            (element as Combobox).control.value = 'tw';
            (element as Combobox).control.dispatchEvent(new InputEvent('input', { data: 'w', inputType: 'insertText' }));

            (element as Combobox).control.value = 'two';
            (element as Combobox).control.dispatchEvent(new InputEvent('input', { data: 'o', inputType: 'insertText' }));

            expect(option2.selected).to.be.true;

            (element as Combobox).control.value = 'twos';
            (element as Combobox).control.dispatchEvent(new InputEvent('input', { data: 's', inputType: 'insertText' }));

            expect(option2.selected).to.be.false;

            (element as Combobox).control.value = 'two';
            (element as Combobox).control.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' }));

            expect(option2.selected).to.be.true;
        });
    });

    it("should reset control's value when user selects current value after typing", async () => {
        const { connect, disconnect, element } = await setup();

        await connect();

        element.value = "three";
        (element as Combobox).autocomplete = "list";

        await DOM.nextUpdate();

        expect(element.control).to.exist;

        (element as Combobox).control.value = "t";
        (element as Combobox).control.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' })); // filter dropdown
        (element as Combobox).open = false;

        const keyDownEvent = new KeyboardEvent("keydown", {
            key: keyArrowDown,
        } as KeyboardEventInit);
        element.dispatchEvent(keyDownEvent); // open dropdown

        await DOM.nextUpdate();
        expect(element.hasAttribute("open")).to.be.true;

        element.dispatchEvent(keyDownEvent); // select "two"
        element.dispatchEvent(keyDownEvent); // select "three"

        const enterEvent = new KeyboardEvent("keydown", {
            key: keyEnter,
        } as KeyboardEventInit);
        element.dispatchEvent(enterEvent); // commit value

        expect((element as Combobox).control.value).to.eq("three");
    });
});
