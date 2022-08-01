import { Updates } from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp, keyEnd, keyHome } from "@microsoft/fast-web-utilities";
import { expect } from "chai";
import { FASTListboxOption, listboxOptionTemplate } from "../listbox-option/index.js";
import { fixture, timeout, uniqueElementName } from "@microsoft/fast-element/testing";;
import { FASTSelect, selectTemplate } from "./index.js";

describe("Select", () => {
    const selectName = uniqueElementName();
    FASTSelect.define({
        name: selectName,
        template: selectTemplate()
    });

    const optionName = uniqueElementName();
    FASTListboxOption.define({
        name: optionName,
        template: listboxOptionTemplate()
    });

    async function setup() {
        const { element, connect, disconnect, parent } = await fixture<FASTSelect>(selectName);

        const option1 = document.createElement(optionName) as FASTListboxOption;
        option1.value = "one";
        option1.textContent = "option one";

        const option2 = document.createElement(optionName) as FASTListboxOption;
        option2.value = "two";
        option2.textContent = "option two";

        const option3 = document.createElement(optionName) as FASTListboxOption;
        option3.value = "three";
        option3.textContent = "option three";

        element.appendChild(option1);
        element.appendChild(option2);
        element.appendChild(option3);

        return { element, connect, disconnect, document, option1, option2, option3, parent };
    }

    it("should have a role of `combobox`", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("role")).to.equal("combobox");

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

    it("should have the attribute aria-expanded set to false", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        expect(element.getAttribute("aria-expanded")).to.equal("false");

        await disconnect();
    });

    it("should NOT have a tabindex when `disabled` is true", async () => {
        const { element, connect, disconnect } = await setup();
        element.disabled = true;

        await connect();

        expect(element.getAttribute("tabindex")).to.equal(null);

        await disconnect();
    });

    it("should set its value to the first enabled option", async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();

        await connect();

        expect(element.value).to.equal("one");
        expect(element.selectedIndex).to.equal(0);

        expect(element.selectedOptions).to.contain(option1);
        expect(element.selectedOptions).to.not.contain(option2);
        expect(element.selectedOptions).to.not.contain(option3);

        await disconnect();
    });

    it("should set its value to the first enabled option when disabled", async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();
        element.disabled = true;

        await connect();

        expect(element.value).to.equal("one");
        expect(element.selectedIndex).to.equal(0);

        expect(element.selectedOptions).to.contain(option1);
        expect(element.selectedOptions).to.not.contain(option2);
        expect(element.selectedOptions).to.not.contain(option3);

        await disconnect();
    });

    it("should select the first option with a `selected` attribute", async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();

        option2.setAttribute("selected", "");

        await connect();

        expect(element.value).to.equal("two");
        expect(element.selectedIndex).to.equal(1);

        expect(element.selectedOptions).to.not.contain(option1);
        expect(element.selectedOptions).to.contain(option2);
        expect(element.selectedOptions).to.not.contain(option3);

        await disconnect();
    });

    it("should select the first option with a `selected` attribute when disabled", async () => {
        const { element, connect, disconnect, option1, option2, option3 } = await setup();
        element.disabled = true;

        option2.setAttribute("selected", "");

        await connect();

        expect(element.value).to.equal("two");
        expect(element.selectedIndex).to.equal(1);

        expect(element.selectedOptions).to.not.contain(option1);
        expect(element.selectedOptions).to.contain(option2);
        expect(element.selectedOptions).to.not.contain(option3);

        await disconnect();
    });

    it("should return the same value when the value property is set before connect", async () => {
        const { element } = await setup();

        element.value = "two";

        expect(element.value).to.equal("two");
    });

    it('should return the same value when the value property is set during connect', async () => {
        const { element, connect, disconnect } = await setup();

        const connectTask = connect();
        element.value = 'two';
        await connectTask;

        expect(element.value).to.equal('two');

        await disconnect();
    });

    it("should return the same value when the value property is set after connect", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.value = "two";

        expect(element.value).to.equal("two");

        await disconnect();
    });

    it("should select the next selectable option when the value is set to match a disabled option", async () => {
        const { element, connect, disconnect, option2 } = await setup();

        option2.disabled = true;

        await connect();

        expect(element.value).to.equal("one");
        expect(element.selectedIndex).to.equal(0);

        element.value = "two";

        expect(element.value).to.equal("three");
        expect(element.selectedIndex).to.equal(2);

        await disconnect();
    });

    it("should update the value when the selected option's value changes", async () => {
        const { element, connect, disconnect, option1 } = await setup();

        await connect();

        expect(element.value).to.equal("one");

        option1.value = "new value";

        expect(element.value).to.equal("new value");

        await disconnect();
    });

    it("should return the value as a string", async () => {
        const { element, connect, disconnect, option1 } = await setup();

        await connect();

        option1.value = 12345 as any;

        expect(element.value).to.equal("12345");

        expect(typeof element.value).to.equal("string");

        await disconnect();
    });

    it("should update the aria-expanded attribute when opened", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();

        element.click();

        await Updates.next();

        expect(element.getAttribute("aria-expanded")).to.equal("true");

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

            expect(element.value).to.equal("two");

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

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via home key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: keyHome,
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                Updates.next().then(() => false),
            ]);

            expect(wasChanged).to.be.false;

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via end key", async () => {
            const { element, connect, disconnect } = await setup();

            element.value = "one";

            await connect();

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: keyEnd,
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                Updates.next().then(() => false),
            ]);

            expect(wasChanged).to.be.false;

            expect(element.value).to.equal("three");

            await disconnect();
        });
    });

    describe("should NOT emit an 'input' event when the value changes by user input while open", () => {
        it("via arrow down key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: keyArrowDown,
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.false;

            expect(element.value).to.equal("two");

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

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.false;

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via home key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: "Home"
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.false;

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via end key", async () => {
            const { element, connect, disconnect } = await setup();

            element.value = "one";

            await connect();

            element.click();

            expect(element.open).to.be.true;

            const event = new KeyboardEvent("keydown", {
                key: keyEnd,
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.false;

            expect(element.value).to.equal("three");

            await disconnect();
        });
    });

    describe("should emit a 'change' event when the value changes by user input while closed", () => {
        it("via arrow down key", async () => {
            const { element, connect, disconnect } = await setup();

            element.value = "one";

            await connect();

            expect(element.value).to.equal("one");

            expect(element.open).to.be.false;

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

            expect(wasChanged).to.be.true;

            expect(element.value).to.equal("two");

            await disconnect();
        });

        it("via arrow up key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = "two";

            expect(element.value).to.equal("two");

            expect(element.open).to.be.false;

            const event = new KeyboardEvent("keydown", {
                key: keyArrowUp
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                Updates.next().then(() => false),
            ]);

            expect(wasChanged).to.be.true;

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via home key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = "three";

            expect(element.value).to.equal("three");

            expect(element.open).to.be.false;

            const event = new KeyboardEvent("keydown", {
                key: keyHome,
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                Updates.next().then(() => false),
            ]);

            expect(wasChanged).to.be.true;

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via end key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(element.open).to.be.false;

            const event = new KeyboardEvent("keydown", {
                key: keyEnd
            } as KeyboardEventInit);

            const wasChanged = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                Updates.next().then(() => false),
            ]);

            expect(wasChanged).to.be.true;

            expect(element.value).to.equal("three");

            await disconnect();
        });

        it("with a sequence of directional inputs", async function () {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = "two";

            expect(element.value).to.equal("two");

            element.click();
            element.click();

            expect(element.open).to.be.false;

            const arrowDownEvent = new KeyboardEvent("keydown", {
                key: keyArrowDown,
            } as KeyboardEventInit);

            const arrowUpEvent = new KeyboardEvent("keydown", {
                key: keyArrowUp,
            } as KeyboardEventInit);

            expect(await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true), { once: true });
                    element.dispatchEvent(arrowUpEvent);
                }),
                timeout().then(() => false),
            ])).to.be.true;

            expect(element.value).to.equal("one");

            expect(await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("change", () => resolve(true), { once: true });
                    element.dispatchEvent(arrowDownEvent);
                }),
                timeout().then(() => false),
            ])).to.be.true;

            expect(element.value).to.equal("two");

            await disconnect();
        });
    });

    describe("should emit an 'input' event when the value changes by user input while closed", () => {
        it("via arrow down key", async () => {
            const { element, connect, disconnect } = await setup();

            element.value = "one";

            await connect();

            expect(element.value).to.equal("one");

            expect(element.open).to.be.false;

            const event = new KeyboardEvent("keydown", {
                key: keyArrowDown,
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.true;

            expect(element.value).to.equal("two");

            await disconnect();
        });

        it("via arrow up key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = "two";

            expect(element.value).to.equal("two");

            expect(element.open).to.be.false;

            const event = new KeyboardEvent("keydown", {
                key: keyArrowUp,
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.true;

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via home key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            element.value = "three";

            expect(element.value).to.equal("three");

            expect(element.open).to.be.false;

            const event = new KeyboardEvent("keydown", {
                key: keyHome,
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.true;

            expect(element.value).to.equal("one");

            await disconnect();
        });

        it("via end key", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(element.open).to.be.false;

            const event = new KeyboardEvent("keydown", {
                key: "End"
            } as KeyboardEventInit);

            const wasInput = await Promise.race([
                new Promise(resolve => {
                    element.addEventListener("input", () => resolve(true));
                    element.dispatchEvent(event);
                }),
                timeout().then(() => false),
            ]);

            expect(wasInput).to.be.true;

            expect(element.value).to.equal("three");

            await disconnect();
        });
    });

    it("should NOT emit a 'change' event when the value changes by programmatic interaction", async () => {
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

    it("should NOT emit an 'input' event when the value changes by programmatic interaction", async () => {
        const { element, connect, disconnect } = await setup();

        element.value = "one";

        await connect();

        expect(element.value).to.equal("one");

        const wasChanged = await Promise.race([
            new Promise(resolve => {
                element.addEventListener("input", () => resolve(true));

                element.value = "two";
            }),
            Updates.next().then(() => false),
        ]);

        expect(wasChanged).to.be.false;

        expect(element.value).to.equal("two");

        await disconnect();
    });

    describe("when the owning form's reset() function is invoked", () => {
        it("should reset the value property to the first enabled option", async () => {
            const { connect, disconnect, element, parent } = await setup();

            element.value = "one";

            const form = document.createElement("form");

            form.appendChild(element);

            parent.appendChild(form);

            await connect();

            expect(element.value).to.equal("one");

            element.value = "two";

            expect(element.value).to.equal("two");

            form.reset();

            expect(element.value).to.equal("one");

            await disconnect();
        });
    });

    it("should set the `aria-activedescendant` attribute to the ID of the currently selected option", async () => {
        const { connect, disconnect, element, option1, option2, option3 } = await setup();

        await connect();

        await Updates.next();

        expect(element.getAttribute("aria-activedescendant")).to.exist.and.equal(option1.id);

        element.selectNextOption();

        await Updates.next();

        expect(element.getAttribute("aria-activedescendant")).to.equal(option2.id);

        element.selectNextOption();

        await Updates.next();

        expect(element.getAttribute("aria-activedescendant")).to.equal(option3.id);

        await disconnect();
    });

    it("should set the `aria-controls` attribute to the ID of the internal listbox element while open", async () => {
        const { connect, disconnect, element } = await setup();

        await connect();

        expect(element.listbox).to.exist;

        const listboxId = element.listbox.id;

        expect(element.getAttribute("aria-controls")).to.exist.and.be.empty;

        element.open = true;

        await Updates.next();

        expect(element.getAttribute("aria-controls")).to.equal(listboxId);

        element.open = false;

        await Updates.next();

        expect(element.getAttribute("aria-controls")).to.be.empty;

        await disconnect();
    });

    describe("should update the `displayValue` when the selected option's content changes", () => {
        it("via innerHTML", async () => {
            const { connect, disconnect, element, option1 } = await setup();

            await connect();

            expect(element.displayValue).to.equal("option one");

            option1.innerHTML = "new value";

            expect(element.displayValue).to.equal("new value");

            await disconnect();
        });

        it("via innerText", async () => {
            const { connect, disconnect, element, option1 } = await setup();

            await connect();

            expect(element.displayValue).to.equal("option one");

            option1.innerText = "new value";

            expect(element.displayValue).to.equal("new value");

            await disconnect();
        });

        it("via textContent", async () => {
            const { connect, disconnect, element, option1 } = await setup();

            await connect();

            expect(element.displayValue).to.equal("option one");

            option1.textContent = "new value";

            expect(element.displayValue).to.equal("new value");

            await disconnect();
        });
    });
});
