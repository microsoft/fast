import { DOM } from "@microsoft/fast-element";
import { expect, assert } from "chai";
import { fixture } from "../test-utilities/fixture";
import { NumberField, numberFieldTemplate as template } from "./index";

const FASTNumberField = NumberField.compose({
    baseName: "number-field",
    template,
})

async function setup() {
    const { element, connect, disconnect, parent } = await fixture(FASTNumberField());

    return { element, connect, disconnect, parent };
}

describe("NumberField", () => {
    it("should set the `autofocus` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const autofocus = true;

        element.autofocus = autofocus;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("autofocus")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `disabled` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const disabled = true;

        element.disabled = disabled;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("disabled")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `list` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const list = "listId";

        element.list = list;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("list")
        ).to.equal(list);

        await disconnect();
    });

    it("should set the `maxlength` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const maxlength = 14;

        element.maxlength = maxlength;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("maxlength")
        ).to.equal(maxlength.toString());

        await disconnect();
    });

    it("should set the `minlength` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const minlength = 8;

        element.minlength = minlength;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("minlength")
        ).to.equal(minlength.toString());

        await disconnect();
    });

    it("should set the `placeholder` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const placeholder = "placeholder";

        element.placeholder = placeholder;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("placeholder")
        ).to.equal(placeholder);

        await disconnect();
    });

    it("should set the `readonly` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const readonly = true;

        element.readOnly = readonly;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("readonly")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `required` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const required = true;

        element.required = required;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("required")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `size` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const size = 8;

        element.size = size;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("size")
        ).to.equal(true);

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

        element.setAttribute("value", "10");
        await connect();

        expect(element.value).to.equal("10");

        await disconnect();
    });

    it("should initialize to the provided value attribute if set post-connection", async () => {
        const { element, connect, disconnect } = await setup();

        await connect();
        element.setAttribute("value", "10");

        expect(element.value).to.equal("10");

        await disconnect();
    });

    it("should initialize to the provided value property if set pre-connection", async () => {
        const { element, connect, disconnect } = await setup();
        element.value = "10";
        await connect();

        expect(element.value).to.equal("10");

        await disconnect();
    });

    describe("Delegates ARIA textbox", () => {
        it("should set the `aria-atomic` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaAtomic = "true";

            element.ariaAtomic = ariaAtomic;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-atomic")
            ).to.equal(ariaAtomic);

            await disconnect();
        });

        it("should set the `aria-busy` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaBusy = "false";

            element.ariaBusy = ariaBusy;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-busy")
            ).to.equal(ariaBusy);

            await disconnect();
        });

        it("should set the `aria-controls` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaControls = "testId";

            element.ariaControls = ariaControls;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-current` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaCurrent = "page";

            element.ariaCurrent = ariaCurrent;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-current")
            ).to.equal(ariaCurrent);

            await disconnect();
        });

        it("should set the `aria-describedBy` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDescribedby = "testId";

            element.ariaDescribedby = ariaDescribedby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-describedBy")
            ).to.equal(ariaDescribedby);

            await disconnect();
        });

        it("should set the `aria-details` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDetails = "testId";

            element.ariaDetails = ariaDetails;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-details")
            ).to.equal(ariaDetails);

            await disconnect();
        });

        it("should set the `aria-disabled` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaDisabled = "true";

            element.ariaDisabled = ariaDisabled;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-disabled")
            ).to.equal(ariaDisabled);

            await disconnect();
        });

        it("should set the `aria-errormessage` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaErrormessage = "test";

            element.ariaErrormessage = ariaErrormessage;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-errormessage")
            ).to.equal(ariaErrormessage);

            await disconnect();
        });

        it("should set the `aria-flowto` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaFlowto = "testId";

            element.ariaFlowto = ariaFlowto;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-flowto")
            ).to.equal(ariaFlowto);

            await disconnect();
        });

        it("should set the `aria-haspopup` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHaspopup = "true";

            element.ariaHaspopup = ariaHaspopup;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-haspopup")
            ).to.equal(ariaHaspopup);

            await disconnect();
        });

        it("should set the `aria-hidden` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaHidden = "true";

            element.ariaHidden = ariaHidden;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-hidden")
            ).to.equal(ariaHidden);

            await disconnect();
        });

        it("should set the `aria-invalid` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaInvalid = "spelling";

            element.ariaInvalid = ariaInvalid;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-invalid")
            ).to.equal(ariaInvalid);

            await disconnect();
        });

        it("should set the `aria-keyshortcuts` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaKeyshortcuts = "F4";

            element.ariaKeyshortcuts = ariaKeyshortcuts;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-keyshortcuts")
            ).to.equal(ariaKeyshortcuts);

            await disconnect();
        });

        it("should set the `aria-label` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabel = "Foo label";

            element.ariaLabel = ariaLabel;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-label")
            ).to.equal(ariaLabel);

            await disconnect();
        });

        it("should set the `aria-labelledby` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLabelledby = "testId";

            element.ariaLabelledby = ariaLabelledby;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-labelledby")
            ).to.equal(ariaLabelledby);

            await disconnect();
        });

        it("should set the `aria-live` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaLive = "polite";

            element.ariaLive = ariaLive;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-live")
            ).to.equal(ariaLive);

            await disconnect();
        });

        it("should set the `aria-owns` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaOwns = "testId";

            element.ariaOwns = ariaOwns;

            await connect();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-owns")
            ).to.equal(ariaOwns);

            await disconnect();
        });

        it("should set the `aria-relevant` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRelevant = "removals";

            element.ariaRelevant = ariaRelevant;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-relevant")
            ).to.equal(ariaRelevant);

            await disconnect();
        });

        it("should set the `aria-roledescription` attribute on the internal control when provided", async () => {
            const { element, connect, disconnect } = await setup();
            const ariaRoledescription = "slide";

            element.ariaRoledescription = ariaRoledescription;

            await connect();

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-roledescription")
            ).to.equal(ariaRoledescription);

            await disconnect();
        });
    });

    describe("events", () => {
        it("should fire a change event the internal control emits a change event", async () => {
            const { element, connect, disconnect } = await setup();
            const event = new Event("change", {
                key: "1",
            } as KeyboardEventInit);
            let wasChanged: boolean = false;

            await connect();

            element.addEventListener("change", e => {
                e.preventDefault();

                wasChanged = true;
            });

            let textarea = element.shadowRoot?.querySelector("input");
            textarea?.dispatchEvent(event);

            expect(wasChanged).to.equal(true);

            await disconnect();
        });

        it("should fire an input event when incrementing or decrementing", async () => {
            const { element, connect, disconnect } = await setup();
            let wasInput: boolean = false;

            element.addEventListener("input", e => {
                e.preventDefault();

                wasInput = true;
            });

            await connect();

            element.stepUp();

            expect(wasInput).to.equal(true);

            wasInput = false;

            element.stepDown();

            expect(wasInput).to.equal(true);

            await disconnect();
        })
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", async () => {
            const { element, connect, disconnect, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = "10";

            assert(element.getAttribute("value") === null);
            assert(element.value === "10");

            form.reset();

            assert(element.value === "");

            await disconnect();
        });

        it("should reset it's value property to the value of the value attribute if it is set", async () => {
            const { element, connect, disconnect, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);
            await connect();

            element.setAttribute("value", "10");

            element.value = "20";

            assert(element.getAttribute("value") === "10");

            assert(element.value === "20");

            form.reset();

            assert(element.value === "10");

            await disconnect();
        });

        it("should put the control into a clean state, where value attribute changes change the property value prior to user or programmatic interaction", async () => {
            const { element, connect, disconnect, parent } = await setup();
            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            await connect();

            element.value = "10";
            element.setAttribute("value", "20");

            assert(element.value === "10");

            form.reset();

            assert(element.value === "20");

            element.setAttribute("value", "30");

            assert(element.value === "30");
            await disconnect();
        });
    });

    describe("min and max values", () => {
        it("should set min value", async () => {
            const { element, connect, disconnect } = await setup();
            const min = 1;

            element.min = min;

            await connect();
            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("min")
            ).to.equal(min.toString());

            await disconnect();
        });

        it("should set max value", async () => {
            const { element, connect, disconnect } = await setup();
            const max = 10;

            element.max = max;

            await connect();
            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("max")
            ).to.equal(max.toString());

            await disconnect();
        });

        it("should set value to max when value is greater than max", async () => {
            const { element, connect, disconnect } = await setup();
            const max = 10;

            element.max = max;
            element.setAttribute("value", `${max + 10}`);

            await connect();
            expect(element.value).to.equal(max.toString());

            await disconnect();
        });

        it("should set value to max if the max changes to a value less than the value", async () => {
            const { element, connect, disconnect } = await setup();
            const max = 10;
            const value = 10 + max;

            element.setAttribute("value", `${value}`);

            await connect();
            expect(element.value).to.equal(value.toString());

            element.setAttribute("max", max.toString());
            await DOM.nextUpdate();

            expect(element.value).to.equal(max.toString());

            await disconnect();
        });

        it("should set value to min when value is less than min", async () => {
            const { element, connect, disconnect } = await setup();
            const min = 10;

            element.min = min;
            element.setAttribute("value", `${min - 10}`);

            await connect();
            expect(element.value).to.equal(min.toString());

            await disconnect();
        });

        it("should set value to min when value is less than min", async () => {
            const { element, connect, disconnect } = await setup();
            const min = 10;
            const value = min - 10;

            element.setAttribute("value", `${value}`);

            await connect();
            expect(element.value).to.equal(value.toString());

            element.setAttribute("min", min.toString());
            await DOM.nextUpdate();

            expect(element.value).to.equal(min.toString());

            await disconnect();
        });

        it("should set max to highest when min is greater than max", async () => {
            const { element, connect, disconnect } = await setup();
            const min = 10;
            const max = 1;

            element.min = min;
            element.max = max;

            await connect();
            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("max")
            ).to.equal(min.toString());

            await disconnect();
        });

        it("should set step to a default of 1", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 1;
            await connect();
            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("step")
            ).to.equal(step.toString());

            await disconnect();
        });

        it("should update step", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 2;

            element.step = step;

            await connect();
            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("step")
            ).to.equal(step.toString());

            await disconnect();
        });

        it("should increment the value by the step amount", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 2;
            const value = 5;

            element.step = step;
            element.value = `${value}`;
            element.stepUp();

            await connect();
            expect(element.value).to.equal(`${value + step}`);

            await disconnect();
        });

        it("should decrement the value by the step amount", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 2;
            const value = 5;

            element.step = step;
            element.value = `${value}`;
            element.stepDown();

            await connect();
            expect(element.value).to.equal(`${value - step}`);

            await disconnect();
        });

        it("should increment no value to the step amount", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 2;
            element.step = step;
            element.stepUp();

            await connect();
            expect(element.value).to.equal(`${step}`);

            await disconnect();
        });

        it("should decrement no value to the negative step amount", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 2;
            element.step = step;
            element.stepDown();

            await connect();
            expect(element.value).to.equal(`${0 - step}`);

            await disconnect();
        });

        it("should update the proxy value when incrementing the value", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 2;
            const value = 5;

            element.step = step;
            element.value = `${value}`;
            element.stepUp();

            await connect();
            expect(element.value).to.equal(`${value + step}`);
            expect(element.proxy.value).to.equal(`${value + step}`);

            await disconnect();
        });

        it("should update the proxy value when decrementing the value", async () => {
            const { element, connect, disconnect } = await setup();
            const step = 2;
            const value = 5;

            element.step = step;
            element.value = `${value}`;
            element.stepDown();

            await connect();
            expect(element.value).to.equal(`${value - step}`);
            expect(element.proxy.value).to.equal(`${value - step}`);

            await disconnect();
        });
    });

    describe("hide step", () => {
        it("should not render step controls when `hide-step` attribute is present", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(element.shadowRoot?.querySelector(".controls")).not.to.equal(null);

            element.setAttribute("hide-step", "");

            await DOM.nextUpdate();

            expect(
                element.shadowRoot?.querySelector(".controls")).to.equal(null);

            await disconnect();
        });
    });

    describe("readonly", () => {
        it("should not render step controls when `readonly` attribute is present", async () => {
            const { element, connect, disconnect } = await setup();

            await connect();

            expect(element.shadowRoot?.querySelector(".controls")).not.to.equal(null);

            element.setAttribute("readonly", "");

            await DOM.nextUpdate();

            expect(
                element.shadowRoot?.querySelector(".controls")).to.equal(null);

            await disconnect();
        });
    });
});
