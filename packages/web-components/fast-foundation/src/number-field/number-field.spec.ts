import { Updates } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture, uniqueElementName } from "@microsoft/fast-element/testing";
import { FASTNumberField, numberFieldTemplate } from "./index.js";

const numberFieldName = uniqueElementName();
FASTNumberField.define({
    name: numberFieldName,
    template: numberFieldTemplate()
});

async function setup(props?: Partial<FASTNumberField>) {
    const { element, connect, disconnect, parent } = await fixture<FASTNumberField>(numberFieldName);

    if(props) {
        for(let key in props) {
            element[key] = props[key].toString();
        }
    }

    await connect();

    return { element, connect, disconnect, parent };
}

describe("NumberField", () => {
    it("should set the `autofocus` attribute on the internal control equal to the value provided", async () => {
        const { element, disconnect } = await setup({autofocus: true});

        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("autofocus")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `disabled` attribute on the internal control equal to the value provided", async () => {
        const { element, disconnect } = await setup({disabled: true});

        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("disabled")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `list` attribute on the internal control equal to the value provided", async () => {
        const list = "listId";
        const { element, disconnect } = await setup({list});

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("list")
        ).to.equal(list);

        await disconnect();
    });

    it("should set the `maxlength` attribute on the internal control equal to the value provided", async () => {
        const maxlength = 14;
        const { element, disconnect } = await setup({maxlength});

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("maxlength")
        ).to.equal(maxlength.toString());

        await disconnect();
    });

    it("should set the `minlength` attribute on the internal control equal to the value provided", async () => {
        const minlength = 8;
        const { element, disconnect } = await setup({minlength});

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("minlength")
        ).to.equal(minlength.toString());

        await disconnect();
    });

    it("should set the `placeholder` attribute on the internal control equal to the value provided", async () => {
        const placeholder = "placeholder";
        const { element, disconnect } = await setup({placeholder});

        expect(
            element.shadowRoot?.querySelector(".control")?.getAttribute("placeholder")
        ).to.equal(placeholder);

        await disconnect();
    });

    it("should set the `readonly` attribute on the internal control equal to the value provided", async () => {
        const { element, disconnect } = await setup({readOnly: true});

        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("readonly")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `required` attribute on the internal control equal to the value provided", async () => {
        const { element, disconnect } = await setup({required: true});

        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("required")
        ).to.equal(true);

        await disconnect();
    });

    it("should set the `size` attribute on the internal control equal to the value provided", async () => {
        const { element, disconnect } = await setup({size: 8});

        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("size")
        ).to.equal(true);

        await disconnect();
    });

    it("should initialize to the initial value if no value property is set", async () => {
        const { element, disconnect } = await setup();

        expect(element.value).to.equal(element["initialValue"]);

        await disconnect();
    });

    it("should initialize to the provided value attribute if set pre-connection", async () => {
        const value = "10";
        const { element, disconnect } = await setup({value});

        expect(element.value).to.equal(value);

        await disconnect();
    });

    it("should initialize to the provided value attribute if set post-connection", async () => {
        const value = "10";
        const { element, disconnect } = await setup();

        element.setAttribute("value", value);

        expect(element.value).to.equal(value);

        await disconnect();
    });

    it("should initialize to the provided value property if set pre-connection", async () => {
        const value = "10";
        const { element, disconnect } = await setup({value});

        expect(element.value).to.equal(value);

        await disconnect();
    });

    describe("Delegates ARIA textbox", () => {
        it("should set the `aria-atomic` attribute on the internal control when provided", async () => {
            const ariaAtomic = "true";
            const { element, disconnect } = await setup({ariaAtomic});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-atomic")
            ).to.equal(ariaAtomic);

            await disconnect();
        });

        it("should set the `aria-busy` attribute on the internal control when provided", async () => {
            const ariaBusy = "false";
            const { element, disconnect } = await setup({ariaBusy});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-busy")
            ).to.equal(ariaBusy);

            await disconnect();
        });

        it("should set the `aria-controls` attribute on the internal control when provided", async () => {
            const ariaControls = "testId";
            const { element, disconnect } = await setup({ariaControls});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-controls")
            ).to.equal(ariaControls);

            await disconnect();
        });

        it("should set the `aria-current` attribute on the internal control when provided", async () => {
            const ariaCurrent = "page";
            const { element, disconnect } = await setup({ariaCurrent});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-current")
            ).to.equal(ariaCurrent);

            await disconnect();
        });

        it("should set the `aria-describedby` attribute on the internal control when provided", async () => {
            const ariaDescribedby = "testId";
            const { element, disconnect } = await setup({ariaDescribedby});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-describedby")
            ).to.equal(ariaDescribedby);

            await disconnect();
        });

        it("should set the `aria-details` attribute on the internal control when provided", async () => {
            const ariaDetails = "testId";
            const { element, disconnect } = await setup({ariaDetails});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-details")
            ).to.equal(ariaDetails);

            await disconnect();
        });

        it("should set the `aria-disabled` attribute on the internal control when provided", async () => {
            const ariaDisabled = "true";
            const { element, disconnect } = await setup({ariaDisabled});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-disabled")
            ).to.equal(ariaDisabled);

            await disconnect();
        });

        it("should set the `aria-errormessage` attribute on the internal control when provided", async () => {
            const ariaErrormessage = "test";
            const { element, disconnect } = await setup({ariaErrormessage});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-errormessage")
            ).to.equal(ariaErrormessage);

            await disconnect();
        });

        it("should set the `aria-flowto` attribute on the internal control when provided", async () => {
            const ariaFlowto = "testId";
            const { element, disconnect } = await setup({ariaFlowto});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-flowto")
            ).to.equal(ariaFlowto);

            await disconnect();
        });

        it("should set the `aria-haspopup` attribute on the internal control when provided", async () => {
            const ariaHaspopup = "true";
            const { element, disconnect } = await setup({ariaHaspopup});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-haspopup")
            ).to.equal(ariaHaspopup);

            await disconnect();
        });

        it("should set the `aria-hidden` attribute on the internal control when provided", async () => {
            const ariaHidden = "true";
            const { element, disconnect } = await setup({ariaHidden});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-hidden")
            ).to.equal(ariaHidden);

            await disconnect();
        });

        it("should set the `aria-invalid` attribute on the internal control when provided", async () => {
            const ariaInvalid = "spelling";
            const { element, disconnect } = await setup({ariaInvalid});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-invalid")
            ).to.equal(ariaInvalid);

            await disconnect();
        });

        it("should set the `aria-keyshortcuts` attribute on the internal control when provided", async () => {
            const ariaKeyshortcuts = "F4";
            const { element, disconnect } = await setup({ariaKeyshortcuts});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-keyshortcuts")
            ).to.equal(ariaKeyshortcuts);

            await disconnect();
        });

        it("should set the `aria-label` attribute on the internal control when provided", async () => {
            const ariaLabel = "Foo label";
            const { element, disconnect } = await setup({ariaLabel});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-label")
            ).to.equal(ariaLabel);

            await disconnect();
        });

        it("should set the `aria-labelledby` attribute on the internal control when provided", async () => {
            const ariaLabelledby = "testId";
            const { element, disconnect } = await setup({ariaLabelledby});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-labelledby")
            ).to.equal(ariaLabelledby);

            await disconnect();
        });

        it("should set the `aria-live` attribute on the internal control when provided", async () => {
            const ariaLive = "polite";
            const { element, disconnect } = await setup({ariaLive});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-live")
            ).to.equal(ariaLive);

            await disconnect();
        });

        it("should set the `aria-owns` attribute on the internal control when provided", async () => {
            const ariaOwns = "testId";
            const { element, disconnect } = await setup({ariaOwns});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("aria-owns")
            ).to.equal(ariaOwns);

            await disconnect();
        });

        it("should set the `aria-relevant` attribute on the internal control when provided", async () => {
            const ariaRelevant = "removals";
            const { element, disconnect } = await setup({ariaRelevant});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-relevant")
            ).to.equal(ariaRelevant);

            await disconnect();
        });

        it("should set the `aria-roledescription` attribute on the internal control when provided", async () => {
            const ariaRoledescription = "slide";
            const { element, disconnect } = await setup({ariaRoledescription});

            expect(
                element.shadowRoot
                    ?.querySelector(".control")
                    ?.getAttribute("aria-roledescription")
            ).to.equal(ariaRoledescription);

            await disconnect();
        });
    });

    describe("events", () => {
        it("should fire a change event when the internal control emits a change event", async () => {
            const { element, disconnect } = await setup();
            const event = new Event("change", {
                key: "1",
            } as KeyboardEventInit);
            let wasChanged: boolean = false;

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
            const { element, disconnect } = await setup();
            let wasInput: boolean = false;

            element.addEventListener("input", e => {
                e.preventDefault();

                wasInput = true;
            });

            element.stepUp();

            expect(wasInput).to.equal(true);

            wasInput = false;

            element.stepDown();

            expect(wasInput).to.equal(true);

            await disconnect();
        });
    });

    describe("when the owning form's reset() method is invoked", () => {
        it("should reset it's value property to an empty string if no value attribute is set", async () => {
            const { element, disconnect, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            const value = "10";
            element.value = value;
            expect(element.value).to.equal(value);

            form.reset();

            expect(element.value).to.equal("");

            await disconnect();
        });

        it("should reset it's value property to the value of the value attribute if it is set", async () => {
            const { element, disconnect, parent } = await setup();

            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);

            element.setAttribute("value", "10");

            element.value = "20";
            expect(element.getAttribute("value")).to.equal("10");
            expect(element.value).to.equal("20");

            form.reset();
            expect(element.value).to.equal("10");

            await disconnect();
        });

        it("should update input field when script sets value", async () => {
            const { element, disconnect, parent } = await setup();
            const value = "10";

            expect(
                (element.shadowRoot?.querySelector(".control") as HTMLInputElement).value
            ).to.be.empty;

            element.setAttribute('value', value);

            await Updates.next();

            expect(
                (element.shadowRoot?.querySelector(".control") as HTMLInputElement).value
            ).to.equal(value);

            await disconnect();
        });

        it("should put the control into a clean state, where value attribute changes the property value prior to user or programmatic interaction", async () => {
            const { element, disconnect, parent } = await setup();
            const form = document.createElement("form");
            form.appendChild(element);
            parent.appendChild(form);
            element.setAttribute("value", "10");

            element.value = "20";
            expect(element.value).to.equal("20");

            form.reset();

            expect(element.value).to.equal("10");

            element.setAttribute("value", "30");
            expect(element.value).to.equal("30");

            await disconnect();
        });
    });

    describe("min and max values", () => {
        it("should set min value", async () => {
            const min = 1;
            const { element, disconnect } = await setup({min});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("min")
            ).to.equal(min.toString());

            await disconnect();
        });

        it("should set max value", async () => {
            const max = 10;
            const { element, connect, disconnect } = await setup({max});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("max")
            ).to.equal(max.toString());

            await disconnect();
        });

        it("should set value to max when value is greater than max", async () => {
            const max = 10;
            const value = '20';
            const { element, disconnect } = await setup({value, max});

            expect(element.value).to.equal(max.toString());

            await disconnect();
        });

        it("should set value to max if the max changes to a value less than the value", async () => {
            const max = 10;
            const value = `${10 + max}`;
            const { element, disconnect } = await setup({value});

            expect(element.value).to.equal(value.toString());

            element.setAttribute("max", max.toString());
            await Updates.next();

            expect(element.value).to.equal(max.toString());

            await disconnect();
        });

        it("should set value to min when value is less than min", async () => {
            const min = 10;
            const value = `${min - 8}`;
            const { element, disconnect } = await setup({value, min});

            expect(element.value).to.equal(min.toString());

            element.value = `${min - 100}`;
            await Updates.next();

            expect(element.value).to.equal(min.toString());
            await disconnect();
        });

        it("should set value to min if the min changes to a value more than the value", async () => {
            const min = 20;
            const value = `${min - 10}`;
            const { element, disconnect } = await setup({value});

            expect(element.value).to.equal(value.toString());

            element.setAttribute("min", min.toString());
            await Updates.next();

            expect(element.value).to.equal(min.toString());

            await disconnect();
        });

        it("should set max to highest when min is greater than max", async () => {
            const min = 10;
            const max = 1;
            const { element, disconnect } = await setup({min, max});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("max")
            ).to.equal(min.toString());

            await disconnect();
        });
    });

    describe("step and increment/decrement", () => {
        it("should set step to a default of 1", async () => {
            const { element, disconnect } = await setup();

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("step")
            ).to.equal("1");

            await disconnect();
        });

        it("should update step", async () => {
            const step = 2;
            const { element, disconnect } = await setup({step});

            expect(
                element.shadowRoot?.querySelector(".control")?.getAttribute("step")
            ).to.equal(step.toString());

            await disconnect();
        });

        it("should increment the value by the step amount", async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({step, value: value.toString()});

            element.stepUp();

            expect(element.value).to.equal(`${value + step}`);

            await disconnect();
        });

        it("should decrement the value by the step amount", async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({step, value: value.toString()});

            element.stepDown();

            expect(element.value).to.equal(`${value - step}`);

            await disconnect();
        });

        it("should increment no value to the step amount", async () => {
            const step = 2;
            const { element, disconnect } = await setup({step});

            element.stepUp();

            expect(element.value).to.equal(`${step}`);

            await disconnect();
        });

        it("should decrement no value to the negative step amount", async () => {
            const step = 2;
            const { element, disconnect } = await setup({step});

            element.stepDown();
            await Updates.next();

            expect(element.value).to.equal(`${0 - step}`);

            await disconnect();
        });

        it("should decrement to zero when no value and negative min", async () => {
            const min = -10;
            const { element, disconnect } = await setup({min});

            element.stepDown();
            await Updates.next();

            expect(element.value).to.equal(`0`);

            await disconnect();
        });

        it("should increment to zero when no value and negative min", async () => {
            const min = -10;
            const { element, disconnect } = await setup({min});

            element.stepUp();
            await Updates.next();

            expect(element.value).to.equal(`0`);

            await disconnect();
        });

        it("should decrement to min when no value and min > 0", async () => {
            const min = 10;
            const { element, disconnect } = await setup({min});

            element.stepDown();
            await Updates.next();

            expect(element.value).to.equal(min.toString());

            await disconnect();
        });

        it("should increment to min when no value and min > 0", async () => {
            const min = 10;
            const { element, disconnect } = await setup({min});

            element.stepUp();
            await Updates.next();

            expect(element.value).to.equal(min.toString());

            await disconnect();
        });

        it("should decrement to max when no value and min and max < 0", async () => {
            const min = -100;
            const max = -10;
            const { element, disconnect } = await setup({min, max});

            element.stepDown();
            await Updates.next();

            expect(element.value).to.equal(max.toString());

            await disconnect();
        });

        it("should increment to mx when no value and min and max < 0", async () => {
            const min = -100;
            const max = -10;
            const { element, disconnect } = await setup({min, max});

            element.stepUp();
            await Updates.next();

            expect(element.value).to.equal(max.toString());

            await disconnect();
        });

        it("should update the proxy value when incrementing the value", async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({step, value: value.toString()});

            element.stepUp();

            expect(element.value).to.equal(`${value + step}`);
            expect(element.proxy.value).to.equal(`${value + step}`);

            await disconnect();
        });

        it("should update the proxy value when decrementing the value", async () => {
            const step = 2;
            const value = 5;
            const { element, disconnect } = await setup({step, value: value.toString()});

            element.stepDown();

            expect(element.value).to.equal(`${value - step}`);
            expect(element.proxy.value).to.equal(`${value - step}`);

            await disconnect();
        });

        it("should correct rounding errors", async () => {
            const step = .1;
            let value = .2.toString();
            const { element, disconnect } = await setup({step, value});
            const incrementValue = () => {
                element.stepUp();
                value = (parseFloat(value) + step).toPrecision(1);
            }

            expect(element.value).to.equal(value);

            incrementValue();
            expect(element.value).to.equal(value);

            incrementValue();
            expect(element.value).to.equal(value);

            incrementValue();
            expect(element.value).to.equal(value);

            incrementValue();
            expect(element.value).to.equal(value);

            await disconnect();
        })
    });

    describe("value validation", () => {
        it("should allow number entry", async () => {
            const value = "18";
            const { element, disconnect } = await setup();

            element.setAttribute("value", value);

            expect(element.value).to.equal(value);

            await disconnect();
        });

        it("should not allow non-number entry", async () => {
            const { element, disconnect } = await setup();

            element.setAttribute("value", "11a");
            expect(element.value).to.equal("11");

            await disconnect();
        });

        it("should allow float number entry", async () => {
            const { element, disconnect } = await setup();
            const floatValue = "37.5";

            element.setAttribute("value", floatValue);
            expect(element.value).to.equal(floatValue);

            await disconnect();
        });

        it("should allow negative number entry", async () => {
            const { element, disconnect } = await setup();

            element.setAttribute("value", "-1");
            expect(element.value).to.equal("-1");

            await disconnect();
        });

        it("should allow negative float entry", async () => {
            const { element, disconnect } = await setup();
            const negativeFloatValue = "-1.5";

            element.setAttribute("value", negativeFloatValue);
            expect(element.value).to.equal(negativeFloatValue);

            await disconnect();
        });
    });

    describe("hide step", () => {
        it("should not render step controls when `hide-step` attribute is present", async () => {
            const { element, disconnect } = await setup();

            expect(element.shadowRoot?.querySelector(".controls")).not.to.equal(null);

            element.setAttribute("hide-step", "");

            await Updates.next();

            expect(
                element.shadowRoot?.querySelector(".controls")).to.equal(null);

            await disconnect();
        });
    });

    describe("readonly", () => {
        it("should not render step controls when `readonly` attribute is present", async () => {
            const { element, disconnect } = await setup();

            expect(element.shadowRoot?.querySelector(".controls")).not.to.equal(null);

            element.setAttribute("readonly", "");

            await Updates.next();

            expect(
                element.shadowRoot?.querySelector(".controls")).to.equal(null);

            await disconnect();
        });
    });

    describe("valueAsNumber", () => {
        it("should allow setting value with number", async () => {
            const { element, disconnect } = await setup();

            element.valueAsNumber = 18;

            expect(element.value).to.equal("18");

            await disconnect();
        });

        it("should allow reading value as number", async () => {
            const { element, disconnect } = await setup();

            element.value = "18";

            expect(element.valueAsNumber).to.equal(18);

            await disconnect();
        });
    });
});
