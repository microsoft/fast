import { customElement } from "@microsoft/fast-element";
import { expect } from "chai";
import { fixture } from "../fixture";
import { TextField, TextFieldTemplate as template, TextFieldTemplate } from "./index";
import { TextFieldType } from "./text-field";

@customElement({
    name: "fast-text-field",
    template,
})
class FASTTextField extends TextField {}

async function setup() {
    const { element, connect, disconnect } = await fixture<FASTTextField>(
        "fast-text-field"
    );

    return { element, connect, disconnect };
}

describe("TextField", () => {
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

    it("should set the `spellcheck` attribute on the internal control equal to the value provided", async () => {
        const { element, connect, disconnect } = await setup();
        const spellcheck = true;

        element.spellcheck = spellcheck;

        await connect();
        expect(
            element.shadowRoot?.querySelector(".control")?.hasAttribute("spellcheck")
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
                key: "a",
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
    });

    describe("with constraint validation", () => {
        Object.keys(TextFieldType)
            .map(key => TextFieldType[key])
            .forEach(type => {
                describe(`of [type="${type}"]`, () => {
                    describe("that is [required]", () => {
                        it("should be invalid when it's value property is an empty string", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();

                            element.type = type;
                            element.required = true;
                            element.value = "";

                            expect(element.validity.valueMissing).to.equal(true);

                            await disconnect();
                        });

                        it("should be valid when value property is a string that is non-empty", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();

                            element.type = type;

                            element.required = true;
                            element.value = "some value";

                            expect(element.validity.valueMissing).to.equal(false);
                            await disconnect();
                        });
                    });
                    describe("that has a [minlength] attribute", () => {
                        it("should be valid if the value is an empty string", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = "";
                            const el = document.createElement(
                                "fast-text-field"
                            ) as TextField;
                            el.type = type;
                            el.value = value;
                            el.minlength = value.length + 1;

                            expect(el.validity.tooShort).to.equal(false);
                        });
                        it("should be valid if the value has a length less than the minlength", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = "value";
                            const el = document.createElement(
                                "fast-text-field"
                            ) as TextField;
                            el.type = type;
                            el.value = value;
                            el.minlength = value.length + 1;

                            expect(el.validity.tooShort).to.equal(false);
                        });
                    });

                    describe("that has a [maxlength] attribute", () => {
                        it("should be valid if the value is an empty string", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();

                            const value = "";
                            const el = document.createElement(
                                "fast-text-field"
                            ) as TextField;
                            el.type = type;
                            el.value = value;
                            el.maxlength = value.length;

                            expect(el.validity.tooLong).to.equal(false);
                        });
                        it("should be valid if the value has a exceeding the maxlength", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = "value";
                            element.type = type;
                            element.value = value;
                            element.maxlength = value.length - 1;

                            expect(element.validity.tooLong).to.equal(false);
                        });
                        it("should be valid if the value has a length shorter than maxlength and the element is [required]", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = "value";
                            element.type = type;
                            element.required = true;
                            element.value = value;
                            element.maxlength = value.length + 1;

                            expect(element.validity.tooLong).to.equal(false);
                        });
                    });

                    describe("that has a [pattern] attribute", () => {
                        it("should be valid if the value matches a pattern", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = "value";
                            element.type = type;
                            element.required = true;
                            element.pattern = value;
                            element.value = value;

                            expect(element.validity.patternMismatch).to.equal(false);
                        });

                        it("should be invalid if the value does not match a pattern", async () => {
                            const { element, connect, disconnect } = await setup();
                            await connect();
                            const value = "value";
                            element.type = type;
                            element.required = true;
                            element.pattern = value;
                            element.value = "foo";

                            expect(element.validity.patternMismatch).to.equal(true);
                        });
                    });
                });
            });
        describe('of [type="email"]', () => {
            it("should be valid when value is an empty string", async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.email;
                element.required = true;
                element.value = "";

                expect(element.validity.typeMismatch).to.equal(false);
            });
            it("should be a typeMismatch when value is not a valid email", async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.email;
                element.required = true;
                element.value = "foobar";

                expect(element.validity.typeMismatch).to.equal(true);
            });
        });
        describe('of [type="url"]', () => {
            it("should be valid when value is an empty string", async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.url;
                element.required = true;
                element.value = "";

                expect(element.validity.typeMismatch).to.equal(false);
            });
            it("should be a typeMismatch when value is not a valid URL", async () => {
                const { element, connect, disconnect } = await setup();
                await connect();
                element.type = TextFieldType.url;
                element.required = true;
                element.value = "foobar";

                expect(element.validity.typeMismatch).to.equal(true);
            });
        });
    });
});
