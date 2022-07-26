import { expect, assert } from "chai";
import { FASTSwitch, switchTemplate } from "./index.js";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { Updates } from "@microsoft/fast-element";
import { keySpace, keyEnter } from "@microsoft/fast-web-utilities";

const switchName = uniqueElementName();
FASTSwitch.define({
    name: switchName,
    template: switchTemplate()
});

async function setup() {
    const { element, connect, disconnect, parent } = await fixture<FASTSwitch>(switchName);

    return { element, connect, disconnect, parent };
}

describe("Switch", () => {
    it("should have a role of `switch`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("switch");

        await disconnect();
    });

    it("should set the `aria-checked` attribute equal to the `checked` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("true");

        element.checked = false;

        await Updates.next();

        expect(element.getAttribute("aria-checked")).to.equal("false");

        await disconnect();
    });

    it("should add a class of `checked` when checked is true", async () => {
        const { element, connect, disconnect } = await setup();

        element.checked = true;

        await connect();

        expect(element.classList.contains("checked")).to.equal(true);

        await disconnect();
    });

    it("should set a default `aria-checked` value when `checked` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-checked")).to.equal("false");

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

    it("should set a default `aria-disabled` value when `disabled` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-disabled")).to.equal("false");

        await disconnect();
    });

    it("should set the `aria-readonly` attribute equal to the `readonly` value", async () => {
        const { element, connect, disconnect } = await setup();

        element.readOnly = true;

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal("true");

        element.readOnly = false;

        await Updates.next();

        expect(element.getAttribute("aria-readonly")).to.equal("false");

        await disconnect();
    });

    it("should NOT set a default `aria-readonly` value when `readonly` is not defined", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-readonly")).to.equal(null);

        await disconnect();
    });

    it("should set a tabindex of 0 on the element", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("tabindex")).to.equal("0");

        await disconnect();
    });

    it("should NOT set a tabindex when disabled is `true`", async () => {
        const { element, connect, disconnect } = await setup();

        element.disabled = true;

        await connect();

        expect(element.hasAttribute("tabindex")).to.equal(false);
        expect(element.getAttribute("tabindex")).to.equal(null);

        await disconnect();
    });

    it("should initialize to the initial value if no value property is set", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        expect(element.value).to.equal(element["initialValue"]);

        await disconnect();
    });

    it("should initialize to the provided value attribute if set pre-connection", async () => {
        const { element, connect, disconnect } = await setup();

        element.setAttribute("value", "foobar");
        await connect();

        expect(element.value).to.equal("foobar");

        await disconnect();
    });

    it("should initialize to the provided value attribute if set post-connection", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        element.setAttribute("value", "foobar");

        expect(element.value).to.equal("foobar");

        await disconnect();
    });

    it("should initialize to the provided value property if set pre-connection", async () => {
        const { element, connect, disconnect } = await setup();
        element.value = "foobar";
        await connect();

        expect(element.value).to.equal("foobar");

        await disconnect();
    });

    describe("label", () => {
        it("should add a class of `label` to the internal label when default slotted content exists", async () => {
            const { element, connect, disconnect } = await setup();

            const label = document.createElement("span");
            element.appendChild(label);

            await connect();

            expect(
                element.shadowRoot?.querySelector("label")?.classList.contains("label")
            ).to.equal(true);

            await disconnect();
        });

        it("should add classes of `label` and `label__hidden` to the internal label when default slotted content exists", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(
                element.shadowRoot?.querySelector("label")?.classList.contains("label")
            ).to.equal(true);
            expect(
                element.shadowRoot
                    ?.querySelector("label")
                    ?.classList.contains("label__hidden")
            ).to.equal(true);

            await disconnect();
        });
    });

    describe("events", () => {
        it("should fire an event on click", async () => {
            const { element, connect, disconnect } = await setup();
            let wasClicked: boolean = false;

            await connect();

            element.addEventListener("click", e => {
                e.preventDefault();

                wasClicked = true;
            });

            await Updates.next();

            element.click();

            expect(wasClicked).to.equal(true);

            await disconnect();
        });

        it("should fire an event when spacebar is invoked", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInvoked: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: keySpace,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasInvoked = true;
            });

            await Updates.next();

            element.dispatchEvent(event);

            expect(wasInvoked).to.equal(true);

            await disconnect();
        });

        it("should fire an event when enter is invoked", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInvoked: boolean = false;
            const event = new KeyboardEvent("keydown", {
                key: keyEnter,
            } as KeyboardEventInit);

            await connect();

            element.addEventListener("keydown", e => {
                e.preventDefault();

                wasInvoked = true;
            });

            await Updates.next();

            element.dispatchEvent(event);

            expect(wasInvoked).to.equal(true);

            await disconnect();
        });
    });


    describe("that is required", () => {
        it("should be invalid when unchecked", async () => {
            const { element, connect, disconnect } = await setup();
            await connect();

            element.required = true;
            element.checked = false;

            expect(element.validity.valueMissing).to.equal(true);

            await disconnect();
        });
        it("should be valid when checked", async () => {
            const { element, connect, disconnect } = await setup();
            await connect();

            element.required = true;
            element.checked = true;

            expect(element.validity.valueMissing).to.equal(false);
            await disconnect();
        });
    });

    describe("who's parent form has it's reset() method invoked", () => {
        it("should set it's checked property to false if the checked attribute is unset", async () => {
            const { element, connect, disconnect, parent } = await setup();
            await connect();

            const form = document.createElement("form");
            parent.appendChild(form);
            form.appendChild(element);
            element.checked = true;

            assert(element.getAttribute("checked") === null);
            assert(element.checked);
            form.reset();

            assert.isFalse(!!element.checked);

            await disconnect();
        });

        it("should set it's checked property to true if the checked attribute is set", async () => {
            const { element, connect, disconnect, parent } = await setup();
            await connect();

            const form = document.createElement("form");
            parent.appendChild(form);
            form.appendChild(element);
            element.setAttribute("checked", "");

            assert(element.getAttribute("checked") === "");
            assert(element.checked);

            element.checked = false;
            assert(!element.checked);
            form.reset();

            assert(element.checked);

            await disconnect();
        });

        it("should put the control into a clean state, where checked attribute changes change the checked property prior to user or programmatic interaction", async () => {
            const { element, connect, disconnect, parent } = await setup();
            await connect();

            const form = document.createElement("form");
            parent.appendChild(form);
            form.appendChild(element);
            element.checked = true;
            element.removeAttribute("checked");

            assert(element.checked);

            form.reset();

            assert.isFalse(!!element.checked);

            element.setAttribute("checked", "");

            assert(element.checked);

            await disconnect();
        });
    });
});
